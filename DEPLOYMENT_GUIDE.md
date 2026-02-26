# Startup Ninja - Production Deployment Guide

**AWS EC2 | Docker | Microservices | Nginx | SSL**

> Written for the Startup Ninja platform comprising a Node.js microservices backend and a Vite + React frontend, deployed on a single AWS EC2 instance using Docker Compose, Nginx reverse proxy, and Let's Encrypt SSL.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [AWS Infrastructure Setup](#2-aws-infrastructure-setup)
3. [Server Environment Setup](#3-server-environment-setup)
4. [Backend Deployment](#4-backend-deployment)
5. [Frontend Deployment](#5-frontend-deployment)
6. [SSL & Nginx Reverse Proxy](#6-ssl--nginx-reverse-proxy)
7. [Redeployment Strategy](#7-redeployment-strategy)
8. [Production Hardening](#8-production-hardening)
9. [Monitoring & Logging](#9-monitoring--logging)
10. [Backup & Disaster Recovery](#10-backup--disaster-recovery)
11. [Scaling Strategy](#11-scaling-strategy)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Architecture Overview

### System Diagram

```
Internet
   │
   ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  AWS EC2 (Ubuntu 22.04)                                                  │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │  Nginx (Host) - Port 80/443                                     │     │
│  │  ┌──────────────────────┐  ┌──────────────────────────────┐     │     │
│  │  │dev.startupninjaai.com│  │ api.startupninjaai.com       │     │     │
│  │  │  → frontend:80       │  │  → api-gateway:5000          │     │     │
│  │  └──────────────────────┘  └──────────────────────────────┘     │     │
│  └─────────────────────────────────────────────────────────────────┘     │
│                                                                          │
│  ┌─────────────────────────── Docker Network ──────────────────────┐     │
│  │                                                                 │     │
│  │  ┌──────────────┐                                               │     │
│  │  │  Frontend    │  (Dockerized Nginx serving static build)      │     │
│  │  │  Port 80     │                                               │     │
│  │  └──────────────┘                                               │     │
│  │                                                                 │     │
│  │  ┌──────────────┐    ┌────────────────────────────────────┐     │     │
│  │  │  API Gateway │───▶│  auth-service         (port 3001)  │     │    │
│  │  │  Port 5000   │───▶│  social-media-service  (port 3003) │     │    │
│  │  │              │───▶│  website-builder       (port 3004) │     │    │
│  │  │              │───▶│  ai-chat-service       (port 3005) │     │    │
│  │  │              │───▶│  chatbot-service       (port 3006) │     │    │
│  │  │              │───▶│  admin-service         (port 5005) │     │    │
│  │  │              │───▶│  imaginative-service   (port 3002) │     │    │
│  │  └──────────────┘    └────────────────────────────────────┘     │    │
│  │                                                                 │    │
│  │  ┌──────────────┐    ┌──────────────┐                           │    │
│  │  │  MongoDB 7.0 │    │  Redis 7     │                           │    │
│  │  │  (Docker)    │    │  (Docker)    │                           │    │
│  │  └──────────────┘    └──────────────┘                           │    │
│  └──────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────┘
```

### Services Inventory

| Service         | Internal Port | Docker Container                      | Database                  |
| --------------- | ------------- | ------------------------------------- | ------------------------- |
| API Gateway     | 5000          | startup-ninja-api-gateway             | Redis (rate limiting)     |
| Auth Service    | 3001          | startup-ninja-auth-service            | startup_ninja_auth        |
| Social Media    | 3003          | startup-ninja-social-media-service    | startup_ninja_social      |
| Website Builder | 3004          | startup-ninja-website-builder-service | startup_ninja_webbuilder  |
| AI Chat         | 3005          | startup-ninja-ai-chat-service         | startup_ninja_aichat      |
| Chatbot         | 3006          | startup-ninja-chatbot-service         | startup_ninja_chatbot     |
| Admin           | 5005          | startup-ninja-admin-service           | startup_ninja_admin       |
| Imaginative     | 3002          | startup-ninja-imaginative-service     | startup_ninja_imaginative |
| MongoDB         | 27017         | startup-ninja-mongodb                 | All databases             |
| Redis           | 6379          | startup-ninja-redis                   | N/A                       |
| Frontend        | 80            | startup-ninja-frontend                | N/A                       |

### Key Design Decisions

- **Single MongoDB instance** with separate databases per service (optimized for a single EC2 instance; uses network aliases for service-level addressing).
- **API Gateway pattern** - only the gateway is publicly exposed; all microservices are internal-only.
- **Host Nginx** handles SSL termination and routes to Docker containers.
- **Frontend** is a Dockerized Nginx container serving the Vite production build and proxying `/api` requests to the API gateway.

---

## 2. AWS Infrastructure Setup

### 2.1 EC2 Instance Selection

| Resource          | Recommendation                         | Rationale                                                                                                                  |
| ----------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Instance Type** | `t3.xlarge` (4 vCPU, 16 GB RAM)        | 9 Docker containers + MongoDB + Redis. A `t3.large` (2 vCPU, 8 GB) works for initial testing but will struggle under load. |
| **AMI**           | Ubuntu Server 22.04 LTS (HVM), SSD     | Long-term support, wide community, Docker-native.                                                                          |
| **Root Volume**   | 30 GB gp3                              | OS + Docker images.                                                                                                        |
| **Data Volume**   | 50–100 GB gp3 (separate EBS)           | MongoDB data, Redis AOF, uploads, logs. Separate volume enables snapshots without OS interference.                         |
| **Region**        | `us-east-1` (or nearest to your users) |                                                                                                                            |

> **Cost-conscious alternative:** Start with `t3.large` (2 vCPU, 8 GB). Monitor CPU credits and upgrade if burstable credits deplete regularly.

### 2.2 Launch the Instance

1. Go to **EC2 Dashboard** → **Launch Instance**.
2. Name: `startup-ninja-production`.
3. Select **Ubuntu Server 22.04 LTS** AMI.
4. Instance type: `t3.xlarge`.
5. Key pair: Create or select an existing `.pem` key pair. **Download and store securely.**
6. Network settings (configure Security Group — see 2.3).
7. Storage: 30 GB gp3 root + Add 80 GB gp3 EBS volume (`/dev/xvdf`).
8. Advanced → IAM instance profile: attach the role from 2.5.
9. Launch.

### 2.3 Security Group Rules

Create a security group named `startup-ninja-sg`:

| Type  | Protocol | Port Range | Source                      | Purpose                       |
| ----- | -------- | ---------- | --------------------------- | ----------------------------- |
| SSH   | TCP      | 22         | Your IP only (`x.x.x.x/32`) | Remote management             |
| HTTP  | TCP      | 80         | 0.0.0.0/0                   | Let's Encrypt ACME + redirect |
| HTTPS | TCP      | 443        | 0.0.0.0/0                   | Production traffic            |

**Do NOT expose** ports 5000, 3001–3006, 3002, 5005, 27017, or 6379 to the internet. All backend traffic flows through Nginx on 443 → Docker internal network.

> **Tip:** If you need temporary debugging access to a service port, add a rule restricted to your IP, debug, then remove it immediately.

### 2.4 Elastic IP

1. **EC2 Dashboard** → **Elastic IPs** → **Allocate Elastic IP address**.
2. Select the new EIP → **Actions** → **Associate Elastic IP address**.
3. Select your `startup-ninja-production` instance.
4. Note the IP (e.g., `54.152.247.90`).

This ensures your server's public IP survives stop/start cycles.

### 2.5 IAM Role (Best Practice)

Create an IAM role named `startup-ninja-ec2-role`:

1. **IAM Console** → **Roles** → **Create Role**.
2. Trusted entity: **AWS Service** → **EC2**.
3. Attach these managed policies:
   - `AmazonS3FullAccess` (for website builder uploads, AI image storage)
   - `CloudWatchAgentServerPolicy` (for monitoring)
   - `AmazonSSMManagedInstanceCore` (enables Session Manager — SSH alternative)
4. Create the role and attach it to the EC2 instance.

> **Production hardening:** Replace `AmazonS3FullAccess` with a scoped policy that grants access only to your specific S3 bucket(s).

### 2.6 EBS Data Volume Setup

After launch, attach and mount the data volume:

```bash
# SSH into the instance
ssh -i "startup-ninja-development.pem" ubuntu@54.159.113.115

# Identify the new volume
lsblk

# Format (ONLY first time — this destroys data)
sudo mkfs -t ext4 /dev/xvdf

# Create mount point
sudo mkdir -p /data

# Mount
sudo mount /dev/xvdf /data

# Persist across reboots
echo '/dev/xvdf /data ext4 defaults,nofail 0 2' | sudo tee -a /etc/fstab

# Set permissions
sudo chown -R ubuntu:ubuntu /data
```

### 2.7 Domain Mapping

In your DNS provider (Route 53, Cloudflare, Namecheap, etc.), create:

| Record Type | Name                     | Value           |
| ----------- | ------------------------ | --------------- |
| A           | `dev.startupninjaai.com` | `54.152.247.90` |
| A           | `api.startupninjaai.com` | `54.152.247.90` |

> Wait for DNS propagation (check with `dig dev.startupninjaai.com`). Propagation typically takes 5–30 minutes.

---

## 3. Server Environment Setup

### 3.1 System Update

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget gnupg lsb-release ca-certificates software-properties-common unzip htop
sudo timedatectl set-timezone UTC
```

### 3.2 Install Docker

```bash
# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add your user to the docker group (avoids sudo for docker commands)
sudo usermod -aG docker $USER

# Apply group membership (or logout and login)
newgrp docker

# Verify
docker --version
docker compose version
```

### 3.3 Install Git

```bash
sudo apt install -y git
git --version
```

### 3.4 Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
nginx -v
```

### 3.5 Configure Firewall (UFW)

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'    # ports 80 and 443
sudo ufw enable
sudo ufw status verbose
```

> **Important:** Do NOT open ports 5000, 3001–3006, 3002, 5005, 27017, 6379. Docker traffic flows over the internal bridge network. Nginx on the host is the sole ingress.

### 3.6 Directory Structure

```bash
sudo mkdir -p /var/www/backend
sudo mkdir -p /var/www/frontend
sudo chown -R $USER:$USER /var/www

# Docker data directory (on the EBS data volume)
sudo mkdir -p /data/docker-volumes
sudo mkdir -p /data/backups
sudo mkdir -p /data/logs
```

Resulting layout:

```
/var/www/
├── backend/           ← startup_ninja_backend repo
└── frontend/          ← startup_ninja_frontend repo

/data/
├── docker-volumes/    ← MongoDB, Redis, uploads (via Docker bind mounts or named volumes)
├── backups/           ← Automated database backups
└── logs/              ← Centralized application logs
```

---

## 4. Backend Deployment

### 4.1 Clone the Repository

```bash
cd /var/www
git clone -b dev-0 https://github.com/Alvi-Global-Enterprises/startup_ninja_backend.git backend
cd backend
```

### 4.2 Repository Structure (What You Already Have)

```
backend/
├── api-gateway/
│   ├── Dockerfile              ← Production-optimized
│   ├── .env.example
│   ├── .env                    ← YOU CREATE THIS
│   └── ...
├── services/
│   ├── auth-service/
│   │   ├── Dockerfile
│   │   ├── .env.example
│   │   ├── .env                ← YOU CREATE THIS
│   │   └── ...
│   ├── social-media-service/
│   ├── website-builder-service/
│   ├── ai-chat/
│   ├── chatbot/
│   ├── admin-service/
│   └── imaginative-service/
├── nginx-proxy/
│   └── nginx.conf
├── docker-compose.prod.yml     ← USE THIS FOR PRODUCTION
├── docker-compose.dev.yml
└── docker-compose.yml
```

### 4.3 Dockerfile Pattern (Already in Each Service)

Every service uses this production-optimized Dockerfile:

```dockerfile
FROM node:20-alpine

RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE <service-port>

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:<service-port>/health || exit 1

CMD ["npm", "start"]
```

Features:

- **Alpine base** — minimal attack surface, ~180 MB image vs ~900 MB for full Node.
- **Non-root user** — containers never run as root.
- **Production-only deps** — `npm ci --only=production` excludes dev dependencies.
- **Health checks** — Docker and Compose use these to determine container readiness.

### 4.4 Configure Environment Variables

Each service needs its own `.env` file. Copy from the examples and fill in real values:

```bash
# API Gateway
cp api-gateway/.env.example api-gateway/.env

# Each microservice
cp services/auth-service/.env.example services/auth-service/.env
cp services/social-media-service/.env.example services/social-media-service/.env
cp services/website-builder-service/.env.example services/website-builder-service/.env
cp services/ai-chat/.env.example services/ai-chat/.env
cp services/chatbot/.env.example services/chatbot/.env
cp services/admin-service/.env.example services/admin-service/.env
cp services/imaginative-service/.env.example services/imaginative-service/.env
```

Edit each `.env` file. Here is the critical configuration per service:

#### API Gateway (`api-gateway/.env`)

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://dev.startupninjaai.com
API_BASE_URL=https://api.startupninjaai.com

# These are overridden in docker-compose.prod.yml but good to have as fallback
AUTH_SERVICE_URL=http://auth-service:3001
SOCIAL_MEDIA_SERVICE_URL=http://social-media-service:3003
WEB_BUILDER_SERVICE_URL=http://website-builder-service:3004
AI_CHAT_SERVICE_URL=http://ai-chat-service:3005
CHATBOT_SERVICE_URL=http://chatbot-service:3006
ADMIN_SERVICE_URL=http://admin-service:5005
IMAGINATIVE_SERVICE_URL=http://imaginative-service:3002

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

JWT_SECRET=<generate-with: openssl rand -hex 32>
REFRESH_TOKEN_SECRET=<generate-with: openssl rand -hex 32>
COOKIE_SECRET=<generate-with: openssl rand -hex 32>
CSRF_SECRET=<generate-with: openssl rand -hex 32>
ENCRYPTION_KEY=<generate-with: openssl rand -hex 32>

PROXY_MAX_RETRIES=1
PROXY_TIMEOUT_MS=15000
PROXY_UPLOAD_TIMEOUT_MS=60000
```

#### Auth Service (`services/auth-service/.env`)

```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://dev.startupninjaai.com
API_BASE_URL=https://api.startupninjaai.com

# Overridden by docker-compose but needed for reference
MONGO_URI=mongodb://mongodb-auth:27017/startup_ninja_auth
REDIS_HOST=redis
REDIS_PORT=6379

JWT_SECRET=<same-as-gateway>
REFRESH_TOKEN_SECRET=<same-as-gateway>
COOKIE_SECRET=<same-as-gateway>
CSRF_SECRET=<same-as-gateway>
ENCRYPTION_KEY=<same-as-gateway>

# OAuth Credentials (use production values)
GOOGLE_CLIENT_ID=your_google_client_id
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_REDIRECT_URI=https://dev.startupninjaai.com/auth/facebook.html
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
INSTAGRAM_REDIRECT_URI=https://dev.startupninjaai.com/auth/instagram.html
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=https://dev.startupninjaai.com/auth/linkedin.html
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_CALLBACK_URL=https://dev.startupninjaai.com/auth/twitter.html
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
MICROSOFT_TENANT_ID=your_microsoft_tenant_id

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=noreply@startupninjaai.com
```

#### Social Media Service (`services/social-media-service/.env`)

```env
NODE_ENV=production
PORT=3003
MONGO_URI=mongodb://mongodb-social:27017/startup_ninja_social
REDIS_HOST=redis
REDIS_PORT=6379
AUTH_SERVICE_URL=http://auth-service:3001
FRONTEND_URL=https://dev.startupninjaai.com

OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
ENCRYPTION_KEY=<same-as-gateway>

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket
```

#### AI Chat Service (`services/ai-chat/.env`)

```env
NODE_ENV=production
PORT=3005
MONGO_URI=mongodb://mongodb-aichat:27017/startup_ninja_aichat
AUTH_SERVICE_URL=http://auth-service:3001
OPENAI_API_KEY=your_openai_key
```

#### Chatbot Service (`services/chatbot/.env`)

```env
NODE_ENV=production
PORT=3006
MONGO_URI=mongodb://mongodb-chatbot:27017/startup_ninja_chatbot
AUTH_SERVICE_URL=http://auth-service:3001
OPENAI_API_KEY=your_openai_key
```

#### Website Builder Service (`services/website-builder-service/.env`)

```env
NODE_ENV=production
PORT=3004
MONGO_URI=mongodb://mongodb-webbuilder:27017/startup_ninja_webbuilder
AUTH_SERVICE_URL=http://auth-service:3001

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket
```

#### Admin Service (`services/admin-service/.env`)

```env
NODE_ENV=production
PORT=5005
MONGO_URI=mongodb://mongodb-admin:27017/startup_ninja_admin
AUTH_SERVICE_URL=http://auth-service:3001
REDIS_HOST=redis
REDIS_PORT=6379
SOCIAL_MEDIA_SERVICE_URL=http://social-media-service:3003
WEB_BUILDER_SERVICE_URL=http://website-builder-service:3004
AI_CHAT_SERVICE_URL=http://ai-chat-service:3005
CHATBOT_SERVICE_URL=http://chatbot-service:3006
IMAGINATIVE_SERVICE_URL=http://imaginative-service:3002
OPENAI_API_KEY=your_openai_key
```

#### Imaginative Service (`services/imaginative-service/.env`)

```env
NODE_ENV=production
PORT=3002
MONGO_URI=mongodb://mongodb-imaginative:27017/startup_ninja_imaginative
AUTH_SERVICE_URL=http://auth-service:3001
GOOGLE_API_KEY=your_google_api_key

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket
```

> **Security:** Never commit `.env` files to Git. Ensure `.gitignore` includes `.env`.

#### Generate Secrets

```bash
# Run this on the server to generate all secrets at once
echo "JWT_SECRET=$(openssl rand -hex 32)"
echo "REFRESH_TOKEN_SECRET=$(openssl rand -hex 32)"
echo "COOKIE_SECRET=$(openssl rand -hex 32)"
echo "CSRF_SECRET=$(openssl rand -hex 32)"
echo "ENCRYPTION_KEY=$(openssl rand -hex 32)"
```

Use the same secrets across services that share them (gateway, auth-service).

### 4.5 Docker Compose Production File

Your `docker-compose.prod.yml` is already production-ready. Key features:

- **Single MongoDB** with network aliases for per-service addressing.
- **Redis** with AOF persistence (`--appendonly yes`).
- **No ports exposed** on microservices — only the API Gateway exposes port 5000.
- **Health checks** on MongoDB, Redis, and all services.
- **Named volumes** for MongoDB data, Redis data, and website builder uploads.
- **Restart policy** `always` on all containers.

### 4.6 Build and Start Backend

```bash
cd /var/www/backend

# Build all images
docker compose -f docker-compose.prod.yml build

# Start all services (detached)
docker compose -f docker-compose.prod.yml up -d

# Watch startup progress
docker compose -f docker-compose.prod.yml logs -f

# Verify all containers are healthy
docker compose -f docker-compose.prod.yml ps
```

Expected output for `docker compose ps`:

```
NAME                                    STATUS                  PORTS
startup-ninja-mongodb                   Up (healthy)
startup-ninja-redis                     Up (healthy)
startup-ninja-auth-service              Up (healthy)
startup-ninja-social-media-service      Up (healthy)
startup-ninja-website-builder-service   Up (healthy)
startup-ninja-ai-chat-service           Up (healthy)
startup-ninja-chatbot-service           Up (healthy)
startup-ninja-admin-service             Up (healthy)
startup-ninja-imaginative-service       Up (healthy)
startup-ninja-api-gateway               Up (healthy)            0.0.0.0:5000->5000/tcp
```

### 4.7 Verify Backend Health

```bash
# Test API Gateway health endpoint
curl http://localhost:5000/health

# Test from outside (before Nginx SSL setup)
curl http://54.152.247.90:5000/health
```

### 4.8 Seed Data (If Needed)

```bash
# Run the plan seeder for the auth service
docker compose -f docker-compose.prod.yml exec auth-service node seed-plans.js
```

---

## 5. Frontend Deployment

### 5.1 Clone the Repository

```bash
cd /var/www
git clone -b dev-0 https://github.com/Alvi-Global-Enterprises/startup_ninja_frontend.git frontend
cd frontend
```

### 5.2 Configure Environment

Create the production `.env` file:

```bash
nano .env
```

```env
VITE_API_BASE_URL=/api
VITE_WEB_BUILDER_SERVICE_URL=https://api.startupninjaai.com
VITE_IMAGINATIVE_SERVICE_URL=https://api.startupninjaai.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id
VITE_MICROSOFT_TENANT_ID=your_microsoft_tenant_id
VITE_MICROSOFT_REDIRECT_URI=https://dev.startupninjaai.com
VITE_GOOGLE_FONTS_API_KEY=your_google_fonts_api_key
VITE_WEBSITE_BUILDER_LICENSE_KEY=your_license_key
VITE_SYSTEM_BASE_DOMAIN=startupninjaai.com
VITE_SYSTEM_IP=54.152.247.90
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

> **Critical:** `VITE_API_BASE_URL=/api` (relative path). The frontend Nginx container proxies `/api` to the API gateway on the Docker network. This avoids CORS issues entirely.

### 5.3 Build and Deploy Frontend Container

#### Option A: Docker Compose (Recommended)

Create a production compose file or use the existing docker-compose.yml:

```bash
cd /var/www/frontend

# Build the frontend image with build args from .env
docker compose build --build-arg VITE_API_BASE_URL=/api \
  --build-arg VITE_WEB_BUILDER_SERVICE_URL=https://api.startupninjaai.com \
  --build-arg VITE_IMAGINATIVE_SERVICE_URL=https://api.startupninjaai.com \
  --build-arg VITE_GOOGLE_CLIENT_ID=your_google_client_id \
  --build-arg VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id \
  --build-arg VITE_MICROSOFT_TENANT_ID=your_microsoft_tenant_id \
  --build-arg VITE_MICROSOFT_REDIRECT_URI=https://dev.startupninjaai.com \
  --build-arg VITE_GOOGLE_FONTS_API_KEY=your_google_fonts_api_key \
  --build-arg VITE_WEBSITE_BUILDER_LICENSE_KEY=your_license_key \
  --build-arg VITE_SYSTEM_BASE_DOMAIN=startupninjaai.com \
  --build-arg VITE_SYSTEM_IP=54.152.247.90 \
  --build-arg VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Start the container
docker compose up -d

# Verify
docker compose ps
```

The frontend container will listen on port 80 internally. The host Nginx (configured in Section 6) will reverse-proxy to it.

#### Option B: Standalone Docker Run

If you prefer not to use Compose for the frontend:

```bash
cd /var/www/frontend

docker build \
  --build-arg VITE_API_BASE_URL=/api \
  --build-arg VITE_SYSTEM_BASE_DOMAIN=startupninjaai.com \
  --build-arg VITE_SYSTEM_IP=54.152.247.90 \
  -t startup-ninja-frontend:latest .

docker run -d \
  --name startup-ninja-frontend \
  --restart always \
  --network startup_ninja_backend_shared-network \
  -p 127.0.0.1:3080:80 \
  startup-ninja-frontend:latest
```

> **Note:** Binding to `127.0.0.1:3080` ensures the frontend container is only accessible from the host (via Nginx), not directly from the internet.

### 5.4 Connect Frontend to Backend Network

The frontend container must be on the same Docker network as the backend so its internal Nginx can proxy `/api` to `api-gateway:5000`.

If using the backend's `docker-compose.prod.yml` network:

```bash
# Find the backend network name
docker network ls | grep backend

# Connect the frontend container to the backend network
docker network connect startup_ninja_backend_shared-network startup-ninja-frontend
```

Or, configure the frontend's `docker-compose.yml` to use the backend's external network (the `docker-compose.dev.yml` already does this).

### 5.5 Frontend Nginx Configuration (Inside the Container)

The `nginx.conf` in the frontend repo is already production-optimized:

- **SPA routing:** `try_files $uri $uri/ /index.html`
- **Static asset caching:** `/assets/` cached for 1 year with immutable header.
- **API proxy:** `/api` → `http://api-gateway:5000` (Docker DNS resolution).
- **Gzip:** Enabled for text, CSS, JS, JSON, SVG.
- **Security headers:** X-Frame-Options, X-XSS-Protection, X-Content-Type-Options, Referrer-Policy.
- **Server tokens off:** Hides Nginx version.

No changes needed to this file for production.

---

## 6. SSL & Nginx Reverse Proxy

### 6.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2 Configure Host Nginx

This is the **host-level** Nginx that terminates SSL and routes to Docker containers.

```bash
sudo nano /etc/nginx/sites-available/startupninja
```

```nginx
# Rate limiting zone
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/s;

# Upstream definitions
upstream frontend_upstream {
    server 127.0.0.1:3080;    # Frontend Docker container
    keepalive 32;
}

upstream backend_upstream {
    server 127.0.0.1:5000;    # API Gateway Docker container
    keepalive 32;
}

# HTTP → HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name dev.startupninjaai.com api.startupninjaai.com;

    # Let's Encrypt ACME challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# Frontend HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name dev.startupninjaai.com;

    ssl_certificate /etc/letsencrypt/live/dev.startupninjaai.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dev.startupninjaai.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    location / {
        proxy_pass http://frontend_upstream;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }
}

# Backend API HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.startupninjaai.com;

    ssl_certificate /etc/letsencrypt/live/dev.startupninjaai.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dev.startupninjaai.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Rate limiting for API
    limit_req zone=api_limit burst=50 nodelay;

    # File upload size (for website builder, image generation)
    client_max_body_size 50M;

    location / {
        proxy_pass http://backend_upstream;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Connection "";

        # Timeouts for long-running AI requests
        proxy_read_timeout 120s;
        proxy_connect_timeout 10s;
        proxy_send_timeout 120s;
    }

    # WebSocket support (if needed for future real-time features)
    location /ws {
        proxy_pass http://backend_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 6.3 Enable the Site

```bash
# Enable the configuration
sudo ln -s /etc/nginx/sites-available/startupninja /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration (will warn about missing SSL certs — that's OK, we get them next)
sudo nginx -t
```

### 6.4 Obtain SSL Certificates

First, temporarily comment out the SSL server blocks (or create a minimal HTTP-only config) so Nginx can start:

```bash
# Create certbot webroot directory
sudo mkdir -p /var/www/certbot

# Get certificates (HTTP challenge — Nginx must be running on port 80)
sudo certbot certonly --webroot \
  -w /var/www/certbot \
  -d dev.startupninjaai.com \
  -d api.startupninjaai.com \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email
```

If the webroot method doesn't work (Nginx not yet running), use standalone mode:

```bash
# Stop Nginx temporarily
sudo systemctl stop nginx

# Get certificate using standalone mode
sudo certbot certonly --standalone \
  -d dev.startupninjaai.com \
  -d api.startupninjaai.com \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email

# Start Nginx again
sudo systemctl start nginx
```

### 6.5 Auto-Renew SSL

Certbot installs a systemd timer by default. Verify:

```bash
sudo systemctl status certbot.timer
```

Add a post-renewal hook to reload Nginx:

```bash
sudo nano /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
```

```bash
#!/bin/bash
systemctl reload nginx
```

```bash
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
```

Test renewal:

```bash
sudo certbot renew --dry-run
```

### 6.6 Restart Nginx with Full Configuration

```bash
sudo nginx -t
sudo systemctl restart nginx
```

### 6.7 Verify Everything

```bash
# Frontend
curl -I https://dev.startupninjaai.com

# Backend API
curl https://api.startupninjaai.com/health

# SSL certificate
echo | openssl s_client -connect dev.startupninjaai.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

## 7. Redeployment Strategy

### 7.1 Backend Redeploy

#### Full Redeploy (All Services)

```bash
cd /var/www/backend
git pull origin dev-0
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

#### Single Service Redeploy (Zero Downtime)

Rebuild and restart only one service without affecting others:

```bash
cd /var/www/backend

# Pull latest code
git pull origin dev-0

# Rebuild only the target service
docker compose -f docker-compose.prod.yml build auth-service

# Restart only the target service (new container replaces old)
docker compose -f docker-compose.prod.yml up -d --no-deps auth-service

# Verify health
docker compose -f docker-compose.prod.yml ps auth-service
```

Replace `auth-service` with any of: `social-media-service`, `website-builder-service`, `ai-chat-service`, `chatbot-service`, `admin-service`, `imaginative-service`, `api-gateway`.

#### Rolling Restart (All Services, Minimal Downtime)

```bash
cd /var/www/backend
git pull origin dev-0
docker compose -f docker-compose.prod.yml build

# Restart services one at a time
for service in auth-service social-media-service website-builder-service ai-chat-service chatbot-service admin-service imaginative-service api-gateway; do
  echo "Restarting $service..."
  docker compose -f docker-compose.prod.yml up -d --no-deps $service
  sleep 15  # Wait for health check to pass
  docker compose -f docker-compose.prod.yml ps $service
done
```

### 7.2 Frontend Redeploy

```bash
cd /var/www/frontend
git pull origin dev-0

# Rebuild with production build args
docker compose build --build-arg VITE_API_BASE_URL=/api \
  --build-arg VITE_SYSTEM_BASE_DOMAIN=startupninjaai.com \
  --build-arg VITE_SYSTEM_IP=54.152.247.90

# Restart container
docker compose up -d
```

### 7.3 Automated Redeploy Script

Create `/var/www/deploy.sh`:

```bash
#!/bin/bash
set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/data/logs/deploy_${TIMESTAMP}.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

deploy_backend() {
    log "=== BACKEND DEPLOYMENT STARTED ==="
    cd /var/www/backend

    log "Pulling latest code..."
    git pull origin dev-0

    log "Building Docker images..."
    docker compose -f docker-compose.prod.yml build 2>&1 | tee -a "$LOG_FILE"

    log "Restarting services..."
    docker compose -f docker-compose.prod.yml up -d 2>&1 | tee -a "$LOG_FILE"

    log "Waiting for health checks..."
    sleep 30

    log "Service status:"
    docker compose -f docker-compose.prod.yml ps | tee -a "$LOG_FILE"

    # Verify API gateway is healthy
    if curl -sf http://localhost:5000/health > /dev/null; then
        log "Backend deployment SUCCESSFUL"
    else
        log "WARNING: API Gateway health check failed!"
    fi
}

deploy_frontend() {
    log "=== FRONTEND DEPLOYMENT STARTED ==="
    cd /var/www/frontend

    log "Pulling latest code..."
    git pull origin dev-0

    log "Building Docker image..."
    docker compose build 2>&1 | tee -a "$LOG_FILE"

    log "Restarting frontend container..."
    docker compose up -d 2>&1 | tee -a "$LOG_FILE"

    log "Frontend deployment SUCCESSFUL"
}

cleanup() {
    log "Cleaning up unused Docker resources..."
    docker image prune -f
    docker builder prune -f
}

case "${1:-all}" in
    backend)
        deploy_backend
        cleanup
        ;;
    frontend)
        deploy_frontend
        cleanup
        ;;
    all)
        deploy_backend
        deploy_frontend
        cleanup
        ;;
    *)
        echo "Usage: $0 {backend|frontend|all}"
        exit 1
        ;;
esac

log "=== DEPLOYMENT COMPLETE ==="
```

```bash
chmod +x /var/www/deploy.sh

# Usage
/var/www/deploy.sh all        # Deploy everything
/var/www/deploy.sh backend    # Deploy backend only
/var/www/deploy.sh frontend   # Deploy frontend only
```

### 7.4 Version Tagging Strategy

```bash
# After a successful deployment, tag the commit
cd /var/www/backend
git tag -a "v1.0.0-$(date +%Y%m%d)" -m "Production release $(date +%Y-%m-%d)"
git push origin --tags

cd /var/www/frontend
git tag -a "v1.0.0-$(date +%Y%m%d)" -m "Production release $(date +%Y-%m-%d)"
git push origin --tags
```

### 7.5 Rollback Procedure

```bash
# If a deployment goes wrong, roll back to the previous version
cd /var/www/backend

# List recent tags
git tag -l --sort=-creatordate | head -5

# Checkout previous version
git checkout v1.0.0-20260225

# Rebuild and restart
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

### 7.6 CI/CD with GitHub Actions (Optional)

Create `.github/workflows/deploy.yml` in the backend repo:

```yaml
name: Deploy to EC2

on:
  push:
    branches: [dev-0]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /var/www/backend
            git pull origin dev-0
            docker compose -f docker-compose.prod.yml build
            docker compose -f docker-compose.prod.yml up -d
            sleep 30
            curl -sf http://localhost:5000/health || echo "HEALTH CHECK FAILED"
```

Create the same for the frontend repo, adjusting the `script` block:

```yaml
name: Deploy Frontend to EC2

on:
  push:
    branches: [dev-0]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /var/www/frontend
            git pull origin dev-0
            docker compose build
            docker compose up -d
```

Set these **GitHub Secrets** on both repos:

- `EC2_HOST`: `54.152.247.90`
- `EC2_SSH_KEY`: Contents of your `.pem` key file

---

## 8. Production Hardening

### 8.1 MongoDB Persistence & Security

MongoDB data is persisted via Docker named volumes (`mongodb_data`). The volume survives container recreation.

**Add authentication** (currently the MongoDB container has no auth):

```bash
# Connect to MongoDB container
docker exec -it startup-ninja-mongodb mongosh

# Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "your_strong_password_here",
  roles: ["root"]
})

# Create application user with limited access
use startup_ninja_auth
db.createUser({
  user: "app_user",
  pwd: "your_app_password_here",
  roles: [
    { role: "readWrite", db: "startup_ninja_auth" },
    { role: "readWrite", db: "startup_ninja_social" },
    { role: "readWrite", db: "startup_ninja_webbuilder" },
    { role: "readWrite", db: "startup_ninja_aichat" },
    { role: "readWrite", db: "startup_ninja_chatbot" },
    { role: "readWrite", db: "startup_ninja_admin" },
    { role: "readWrite", db: "startup_ninja_imaginative" }
  ]
})
```

Then update `docker-compose.prod.yml` to enable auth:

```yaml
mongodb:
  image: mongo:7.0
  command: ["mongod", "--auth"]
  environment:
    MONGO_INITDB_ROOT_USERNAME: admin
    MONGO_INITDB_ROOT_PASSWORD: your_strong_password_here
```

And update all service `MONGO_URI` values:

```
mongodb://app_user:your_app_password@mongodb-auth:27017/startup_ninja_auth?authSource=startup_ninja_auth
```

### 8.2 Redis Persistence & Security

Redis is already configured with AOF persistence (`--appendonly yes`). Enhance security:

Update the `redis` service in `docker-compose.prod.yml`:

```yaml
redis:
  image: redis:7-alpine
  command: >
    redis-server
    --appendonly yes
    --requirepass your_redis_password
    --maxmemory 512mb
    --maxmemory-policy allkeys-lru
```

Update all service `.env` files:

```env
REDIS_PASSWORD=your_redis_password
```

### 8.3 Fail2ban

```bash
sudo apt install -y fail2ban

sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
backend = systemd

[sshd]
enabled = true
port = ssh
filter = sshd
maxretry = 3
bantime = 86400

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
bantime = 600
```

```bash
sudo systemctl enable fail2ban
sudo systemctl restart fail2ban
sudo fail2ban-client status
```

### 8.4 SSH Hardening

```bash
sudo nano /etc/ssh/sshd_config
```

Key changes:

```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
```

```bash
sudo systemctl restart sshd
```

### 8.5 Automatic Security Updates

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 8.6 Docker Resource Limits

Add resource limits to `docker-compose.prod.yml` services to prevent runaway containers:

```yaml
auth-service:
  deploy:
    resources:
      limits:
        cpus: "0.5"
        memory: 512M
      reservations:
        cpus: "0.1"
        memory: 128M
```

Suggested limits per service (for t3.xlarge with 16 GB RAM):

| Service                 | CPU Limit | Memory Limit |
| ----------------------- | --------- | ------------ |
| MongoDB                 | 1.0       | 4G           |
| Redis                   | 0.5       | 1G           |
| API Gateway             | 0.5       | 512M         |
| auth-service            | 0.5       | 512M         |
| social-media-service    | 0.5       | 512M         |
| website-builder-service | 0.5       | 512M         |
| ai-chat-service         | 0.5       | 512M         |
| chatbot-service         | 0.5       | 512M         |
| admin-service           | 0.5       | 512M         |
| imaginative-service     | 0.5       | 512M         |
| Frontend                | 0.25      | 256M         |

### 8.7 PM2 vs Docker

Your codebase includes both `ecosystem.config.json` (PM2) and Dockerfiles. Here is the guidance:

| Aspect                  | PM2                                 | Docker                              |
| ----------------------- | ----------------------------------- | ----------------------------------- |
| **Isolation**           | Processes share the host Node.js    | Each service in its own container   |
| **Dependency conflict** | All services share node_modules     | Each service has its own deps       |
| **Restart**             | PM2 auto-restarts crashed processes | Docker restart policy does the same |
| **Resource limits**     | Possible but crude                  | Native cgroup limits                |
| **Reproducibility**     | Depends on host environment         | Identical across any Docker host    |
| **Scaling**             | Multiple instances of same process  | Multiple containers or Swarm/K8s    |
| **Logging**             | PM2 log files, log rotation         | `docker logs`, centralized drivers  |

**Verdict:** Use Docker for production. PM2 is fine for local development without Docker but adds no value inside containers (you'd just have Docker restarting PM2 restarting Node — redundant process management).

---

## 9. Monitoring & Logging

### 9.1 Docker Logging Configuration

Add to each service in `docker-compose.prod.yml`:

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "5"
```

This caps each container's logs at 50 MB (5 files x 10 MB) with automatic rotation.

### 9.2 View Logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f auth-service

# Last 100 lines
docker compose -f docker-compose.prod.yml logs --tail=100 api-gateway
```

### 9.3 System Monitoring with htop

```bash
htop       # Real-time process monitoring
docker stats  # Real-time container resource usage
```

### 9.4 CloudWatch Agent (AWS Native)

```bash
# Download and install
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb

# Configure
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard

# Start
sudo systemctl enable amazon-cloudwatch-agent
sudo systemctl start amazon-cloudwatch-agent
```

Key metrics to monitor:

- CPU utilization (alert > 80%)
- Memory utilization (alert > 85%)
- Disk usage (alert > 80%)
- Network I/O

### 9.5 Prometheus + Grafana (Self-Hosted Alternative)

For more detailed monitoring, add to `docker-compose.prod.yml`:

```yaml
prometheus:
  image: prom/prometheus:latest
  container_name: startup-ninja-prometheus
  restart: always
  volumes:
    - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    - prometheus_data:/prometheus
  networks:
    - shared-network

grafana:
  image: grafana/grafana:latest
  container_name: startup-ninja-grafana
  restart: always
  ports:
    - "127.0.0.1:3100:3000"
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=your_grafana_password
  volumes:
    - grafana_data:/var/lib/grafana
  networks:
    - shared-network
```

Access Grafana via SSH tunnel:

```bash
ssh -L 3100:localhost:3100 ubuntu@54.152.247.90
# Then open http://localhost:3100 in your browser
```

### 9.6 Health Check Dashboard Script

Create `/var/www/healthcheck.sh`:

```bash
#!/bin/bash

echo "========================================"
echo "  Startup Ninja Health Dashboard"
echo "  $(date)"
echo "========================================"
echo ""

# System resources
echo "--- SYSTEM RESOURCES ---"
echo "CPU Load: $(uptime | awk -F'load average:' '{print $2}')"
echo "Memory: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
echo "Disk: $(df -h / | awk 'NR==2 {print $3 "/" $2 " (" $5 " used)"}')"
echo "Data Volume: $(df -h /data | awk 'NR==2 {print $3 "/" $2 " (" $5 " used)"}')"
echo ""

# Docker containers
echo "--- DOCKER CONTAINERS ---"
docker compose -f /var/www/backend/docker-compose.prod.yml ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
echo ""
docker compose -f /var/www/frontend/docker-compose.yml ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Health endpoints
echo "--- HEALTH ENDPOINTS ---"
services=("http://localhost:5000/health:API-Gateway")
for entry in "${services[@]}"; do
    url="${entry%%:*}"
    name="${entry##*:}"
    status=$(curl -sf -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "FAIL")
    echo "  $name: $status"
done
echo ""

# Docker resource usage
echo "--- CONTAINER RESOURCES ---"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
```

```bash
chmod +x /var/www/healthcheck.sh
```

---

## 10. Backup & Disaster Recovery

### 10.1 MongoDB Backup

Create `/var/www/backup.sh`:

```bash
#!/bin/bash
set -euo pipefail

BACKUP_DIR="/data/backups/mongodb"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting MongoDB backup..."

# Dump all databases
docker exec startup-ninja-mongodb mongodump --out "/data/backup_${TIMESTAMP}"

# Copy from container to host
docker cp "startup-ninja-mongodb:/data/backup_${TIMESTAMP}" "${BACKUP_DIR}/backup_${TIMESTAMP}"

# Clean up container-side backup
docker exec startup-ninja-mongodb rm -rf "/data/backup_${TIMESTAMP}"

# Compress
cd "$BACKUP_DIR"
tar -czf "backup_${TIMESTAMP}.tar.gz" "backup_${TIMESTAMP}"
rm -rf "backup_${TIMESTAMP}"

# Remove old backups
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +${RETENTION_DAYS} -delete

# Optional: Upload to S3
# aws s3 cp "${BACKUP_DIR}/backup_${TIMESTAMP}.tar.gz" "s3://your-backup-bucket/mongodb/"

echo "[$(date)] Backup complete: backup_${TIMESTAMP}.tar.gz"
echo "Size: $(du -h "${BACKUP_DIR}/backup_${TIMESTAMP}.tar.gz" | awk '{print $1}')"
```

```bash
chmod +x /var/www/backup.sh
```

### 10.2 Schedule Automated Backups

```bash
# Run daily at 3 AM UTC
crontab -e
```

```
0 3 * * * /var/www/backup.sh >> /data/logs/backup.log 2>&1
```

### 10.3 Restore from Backup

```bash
# Extract backup
cd /data/backups/mongodb
tar -xzf backup_20260226_030000.tar.gz

# Copy into MongoDB container
docker cp backup_20260226_030000 startup-ninja-mongodb:/data/restore

# Restore
docker exec startup-ninja-mongodb mongorestore /data/restore

# Cleanup
docker exec startup-ninja-mongodb rm -rf /data/restore
```

### 10.4 EBS Snapshot Backup

For full-server point-in-time recovery:

```bash
# Create a snapshot of the data volume via AWS CLI
aws ec2 create-snapshot \
  --volume-id vol-xxxxxxxx \
  --description "Startup Ninja data volume backup $(date +%Y-%m-%d)" \
  --tag-specifications "ResourceType=snapshot,Tags=[{Key=Name,Value=startup-ninja-backup}]"
```

Schedule with a cron job or use AWS Backup service.

### 10.5 Docker Volume Backup

```bash
# Backup all named volumes
for vol in mongodb_data redis_data webbuilder_uploads webbuilder_published; do
    full_vol="startup_ninja_backend_${vol}"
    echo "Backing up ${full_vol}..."
    docker run --rm \
        -v "${full_vol}:/source:ro" \
        -v /data/backups:/backup \
        alpine tar czf "/backup/${vol}_$(date +%Y%m%d).tar.gz" -C /source .
done
```

---

## 11. Scaling Strategy

### 11.1 Vertical Scaling (Quick Win)

```
t3.large (2 vCPU, 8 GB)  →  t3.xlarge (4 vCPU, 16 GB)  →  t3.2xlarge (8 vCPU, 32 GB)
```

Steps:

1. Stop the instance.
2. Change instance type.
3. Start the instance.
4. Containers auto-start (restart policy: always).

### 11.2 Horizontal Scaling with Load Balancer

When a single EC2 instance isn't enough:

```
                    ┌─────────────────────┐
                    │   ALB (Application   │
Internet ──────────▶│   Load Balancer)    │
                    └──────┬──────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
         ┌────────┐  ┌────────┐  ┌────────┐
         │ EC2 #1 │  │ EC2 #2 │  │ EC2 #3 │
         │ (App)  │  │ (App)  │  │ (App)  │
         └────────┘  └────────┘  └────────┘
                           │
                    ┌──────┴──────┐
                    │  RDS MongoDB │  (or Atlas)
                    │  ElastiCache │  (Redis)
                    └─────────────┘
```

Key changes for horizontal scaling:

1. **Externalize databases:** Move MongoDB to Atlas or DocumentDB. Move Redis to ElastiCache.
2. **Shared file storage:** Move website builder uploads to S3 (already using S3 in the codebase).
3. **Session management:** Already using Redis for sessions — just point all instances to the same Redis.
4. **ALB Setup:**
   - Create an Application Load Balancer.
   - Create Target Groups for port 5000 (backend) and port 80 (frontend).
   - Configure health checks on `/health`.
   - Route based on hostname (`dev.*` → frontend TG, `api.*` → backend TG).

### 11.3 Docker Swarm (Middle Ground)

If you're not ready for Kubernetes but need multi-node:

```bash
# On the manager node
docker swarm init

# On worker nodes
docker swarm join --token <token> <manager-ip>:2377

# Deploy stack
docker stack deploy -c docker-compose.prod.yml startup-ninja
```

### 11.4 Nginx Upstream Load Balancing (Multiple Instances on Same Host)

If you scale to 2+ API Gateway containers:

```nginx
upstream backend_upstream {
    least_conn;
    server 127.0.0.1:5000;
    server 127.0.0.1:5001;
    keepalive 32;
}
```

---

## 12. Troubleshooting

### Common Issues

#### Containers Won't Start

```bash
# Check logs
docker compose -f docker-compose.prod.yml logs <service-name>

# Check if ports are in use
sudo lsof -i :5000
sudo lsof -i :27017

# Inspect container
docker inspect <container-name>
```

#### MongoDB Connection Refused

```bash
# Check MongoDB is running
docker compose -f docker-compose.prod.yml ps mongodb

# Connect manually
docker exec -it startup-ninja-mongodb mongosh

# Check network
docker network inspect startup_ninja_backend_shared-network
```

#### Redis Connection Issues

```bash
docker exec -it startup-ninja-redis redis-cli ping
```

#### Out of Disk Space

```bash
# Check disk usage
df -h

# Docker disk usage
docker system df

# Clean up
docker system prune -a --volumes  # WARNING: removes ALL unused data
docker image prune -a             # Remove unused images only
docker builder prune              # Remove build cache
```

#### Container Health Check Failing

```bash
# Check health status
docker inspect --format='{{json .State.Health}}' <container-name> | python3 -m json.tool

# Run health check manually
docker exec <container-name> wget --quiet --tries=1 --spider http://localhost:<port>/health
```

#### High Memory Usage

```bash
# Check per-container usage
docker stats --no-stream

# Restart a memory-hungry container
docker compose -f docker-compose.prod.yml restart <service-name>
```

#### SSL Certificate Renewal Fails

```bash
# Check certificate expiry
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

### Useful Commands Reference

```bash
# View all container logs
docker compose -f docker-compose.prod.yml logs -f --tail=50

# Enter a container shell
docker exec -it startup-ninja-api-gateway sh

# Restart a single service
docker compose -f docker-compose.prod.yml restart auth-service

# Stop everything
docker compose -f docker-compose.prod.yml down

# Stop everything AND remove volumes (DATA LOSS)
docker compose -f docker-compose.prod.yml down -v

# View Docker networks
docker network ls

# View Docker volumes
docker volume ls

# Full system health
/var/www/healthcheck.sh
```

---

## Quick Reference Card

| Action                       | Command                                                                                                                      |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Deploy everything**        | `/var/www/deploy.sh all`                                                                                                     |
| **Deploy backend only**      | `/var/www/deploy.sh backend`                                                                                                 |
| **Deploy frontend only**     | `/var/www/deploy.sh frontend`                                                                                                |
| **View all logs**            | `docker compose -f /var/www/backend/docker-compose.prod.yml logs -f`                                                         |
| **Check health**             | `curl http://localhost:5000/health`                                                                                          |
| **Restart single service**   | `docker compose -f docker-compose.prod.yml restart <name>`                                                                   |
| **Rebuild single service**   | `docker compose -f docker-compose.prod.yml build <name> && docker compose -f docker-compose.prod.yml up -d --no-deps <name>` |
| **Backup MongoDB**           | `/var/www/backup.sh`                                                                                                         |
| **Check SSL**                | `sudo certbot certificates`                                                                                                  |
| **Container resource usage** | `docker stats`                                                                                                               |
| **System health dashboard**  | `/var/www/healthcheck.sh`                                                                                                    |

---

_Last updated: February 26, 2026_
