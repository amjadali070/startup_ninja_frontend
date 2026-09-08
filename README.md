# Startup Ninja — Frontend

React + TypeScript client for Startup Ninja, an AI-powered workspace for founders and small
businesses. Talks to the [`startup_ninja_backend`](https://github.com/amjadali070/startup_ninja_backend)
microservices through a single API Gateway.

## Features

- **Auth**: email/password, Google & Microsoft OAuth, email verification, password reset
- **AI Chat**: conversational assistant with persistent memory, follow-up suggestions, file
  attachments, and web search citations
- **AI Image Gen**: prompt-to-image generation with presets and iterative editing
- **Web Builder**: drag-and-drop site builder, templates, publishing, custom domains
- **Social Pro**: social media post creation, scheduling, and publishing
- **Ninja Sales**: a full sales CRM — leads, pipeline, projects/deals, follow-ups and
  tasks, AI lead scoring and outreach drafting, proposals & invoices with PDF generation,
  per-account SMTP email sending (confidential, owner/manager-only), and automatic reminders
  for overdue follow-ups and hot leads
- **Ninja Legal**: AI contract generation and analysis
- **Billing & Subscriptions**: plans, usage, billing history
- **Team Management**: invite members, assign roles/permissions
- **Admin**: platform-wide analytics and account management

## Quick Start

### Prerequisites

- Node.js 18+
- The backend running (see [`startup_ninja_backend`](https://github.com/amjadali070/startup_ninja_backend)) — defaults to `http://localhost:5000`

### Setup

```bash
git clone https://github.com/amjadali070/startup_ninja_frontend.git
cd startup_ninja_frontend
npm install
cp env.example .env
# Edit .env — API base URL, OAuth client IDs, etc.
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`tsc`) and build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint

## Environment Variables

Copy `env.example` to `.env` and configure:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WEB_BUILDER_SERVICE_URL=http://localhost:3004
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
VITE_MICROSOFT_CLIENT_ID=your-microsoft-application-client-id
VITE_GOOGLE_FONTS_API_KEY=your-google-fonts-api-key
VITE_SYSTEM_BASE_DOMAIN=localhost
VITE_SYSTEM_IP=127.0.0.1
```

Never commit a real `.env` — `.gitignore` excludes it; only `env.example` (a safe template)
is tracked.

## Project Structure

```text
src/
├── components/           # Reusable UI, feature components (ninja-sales/, web-builder/, ai-chat/, ...)
├── hooks/                # Custom React hooks (auth, drafts, etc.)
├── layouts/              # Page layout shells (DashboardLayout, ...)
├── pages/
│   ├── Auth/              # Login, register, OAuth, password reset
│   ├── User/               # Dashboard, AI Chat/Image, Web Builder, Social Pro,
│   │                        NinjaSales/, NinjaLegal/, TeamManagement/, Settings, Billing
│   ├── Admin/              # Admin dashboard & tools
│   ├── Legal/               # Terms, Privacy, Refund Policy, etc.
│   └── landing-page/        # Public marketing site
├── services/              # Typed API clients per domain (ninjaSales.ts, ai-chat/, web-builder/, ...)
├── types/                 # Shared TypeScript types
├── App.tsx
└── main.tsx
```

## Tech Stack

React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios, react-hot-toast.

## Security

- JWT stored client-side and attached to every request via the shared API client
- Input validation on all forms
- Confidential surfaces (e.g. SMTP credentials in Ninja Sales → Email Sending) are gated
  both by nav-item visibility and a matching server-side permission check
- CORS-compliant requests through the API Gateway only — no service is called directly

## License

MIT
