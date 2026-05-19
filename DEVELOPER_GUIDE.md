# Startup Ninja — Frontend Developer Guide

> Complete onboarding reference for the frontend codebase. Read alongside `../startup_ninja_backend/DEVELOPER_GUIDE.md` for the full picture.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Getting Started](#4-getting-started)
5. [Environment Variables](#5-environment-variables)
6. [Configuration Files](#6-configuration-files)
7. [Routing & Route Guards](#7-routing--route-guards)
8. [Layouts](#8-layouts)
9. [Authentication](#9-authentication)
10. [API Client](#10-api-client)
11. [Services Layer](#11-services-layer)
12. [Pages](#12-pages)
13. [Components](#13-components)
14. [Hooks](#14-hooks)
15. [Utils & Constants](#15-utils--constants)
16. [Styling Guide](#16-styling-guide)
17. [Third-Party Integrations](#17-third-party-integrations)
18. [Docker & Deployment](#18-docker--deployment)
19. [Key Patterns & Conventions](#19-key-patterns--conventions)

---

## 1. Overview

The frontend is a **React 18 + TypeScript + Vite** single-page application. It communicates exclusively with the **API Gateway** at port `5000` — it never calls individual microservices directly.

The app covers:
- Public marketing / landing pages
- Auth flows (register, login, OAuth, email verification, password reset)
- User dashboard with all AI tools (chat, image gen, social media, web builder, legal, sales, finance, ops)
- Admin dashboard (platform analytics, user management, plan management, API balance)
- Settings, billing, team management
- Public utility pages (unsubscribe, terms, privacy)

---

## 2. Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| TypeScript | 5 | Type safety across the entire codebase |
| Vite | 7 | Build tool, dev server, HMR |
| React Router DOM | 6 | Client-side routing |
| Tailwind CSS | 3 | Utility-first styling |
| `@tailwindcss/typography` | 0.5 | Prose styling for AI-generated markdown |
| Axios | 1.6 | HTTP client (wrapped in `ApiClient` class) |
| React Hook Form | 7 | Form state and validation |
| React Hot Toast | 2 | Toast notifications |
| React Icons | 5 | Icon library (FaXxx, MdXxx, etc.) |
| React Markdown | 10 | Render AI chat responses as markdown |
| Highlight.js | 11 | Code syntax highlighting in AI chat |
| Moment + moment-timezone | 2.30 | Date formatting and timezone conversion |
| `@stripe/react-stripe-js` | 5 | Stripe payment UI elements |
| `@stripe/stripe-js` | 8 | Stripe.js loader |
| `@react-oauth/google` | 0.12 | Google OAuth button |
| `@azure/msal-browser` | 4 | Microsoft OAuth (MSAL) |
| `@azure/msal-react` | 3 | Microsoft OAuth React bindings |
| `@grapesjs/studio-sdk` | 1 | No-code website builder canvas |
| `@grapesjs/studio-sdk-plugins` | 1 | GrapesJS plugin pack |
| `@hello-pangea/dnd` | 18 | Drag-and-drop for Kanban pipeline |
| jsPDF | 4 | PDF export for contracts and proposals |
| html2canvas | 1 | Screenshot DOM for PDF generation |
| vite-plugin-mkcert | 1.17 | Local HTTPS (required for OAuth callbacks) |

---

## 3. Project Structure

```
startup_ninja_frontend/
├── public/
│   ├── auth/              # Static OAuth callback HTML pages (twitter, facebook, instagram)
│   ├── images/            # Static images (logos, backgrounds)
│   ├── svg/               # SVG assets
│   └── favicon.svg
│
├── src/
│   ├── App.tsx            # Root component — all routes defined here
│   ├── main.tsx           # ReactDOM entry point, provider wrappers
│   ├── index.css          # Global styles, Tailwind base, custom scrollbars, animations
│   ├── vite-env.d.ts      # Vite env type declarations
│   │
│   ├── components/        # Reusable UI components grouped by feature domain
│   │   ├── admin-dashboard/
│   │   ├── ai-chat/
│   │   ├── ai-image-gen/
│   │   ├── ai-tools/
│   │   ├── chatbot/
│   │   ├── dashboard/
│   │   ├── landing-page/
│   │   ├── ninja-finance/
│   │   ├── ninja-legal/
│   │   ├── ninja-ops/
│   │   ├── ninja-sales/
│   │   ├── payment/
│   │   ├── settings/
│   │   ├── social-media/
│   │   ├── subscription/
│   │   ├── team-management/
│   │   ├── web-builder/
│   │   ├── AlertModal.tsx
│   │   ├── Button.tsx
│   │   ├── EmailVerificationModal.tsx
│   │   ├── GoogleSignUp.tsx
│   │   ├── IconSelect.tsx
│   │   ├── Input.tsx
│   │   ├── LiveChatWidget.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── MicrosoftSignUp.tsx
│   │   ├── Navbar.tsx
│   │   ├── NotificationModal.tsx
│   │   ├── RouteGuards.tsx
│   │   ├── ScrollToTop.tsx
│   │   ├── SessionExpiredModal.tsx
│   │   └── SocialAuth.tsx
│   │
│   ├── constants/
│   │   ├── platforms.ts   # Social platform definitions
│   │   └── timezones.ts   # IANA timezone list with UTC offsets
│   │
│   ├── data/
│   │   └── countries.ts   # Country list for forms
│   │
│   ├── hooks/
│   │   ├── useAuth.tsx    # Auth context provider + hook
│   │   ├── useAuth.ts     # (legacy alias — use useAuth.tsx)
│   │   ├── useAdminData.ts
│   │   └── useUserTimezone.ts
│   │
│   ├── layouts/
│   │   ├── AdminDashboardLayout.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── FrontLayout.tsx
│   │   └── PublicLayout.tsx
│   │
│   ├── lib/
│   │   └── msalConfig.ts  # Microsoft MSAL configuration
│   │
│   ├── pages/
│   │   ├── Admin/
│   │   ├── Auth/
│   │   ├── landing-page/
│   │   ├── Legal/
│   │   ├── Subscription/
│   │   ├── User/
│   │   ├── ComingSoon.tsx
│   │   ├── NotFound.tsx
│   │   └── Unsubscribe.tsx
│   │
│   ├── services/          # All API call functions
│   │   ├── ai-chat/
│   │   ├── chatbot/
│   │   ├── social-media/
│   │   ├── web-builder/
│   │   ├── admin.ts
│   │   ├── ai-chat.ts
│   │   ├── apiClient.ts   # Axios singleton with interceptors
│   │   ├── auth.ts
│   │   ├── imageGenService.ts
│   │   ├── ninja-legal.ts
│   │   ├── ninjaSales.ts
│   │   ├── notifications.ts
│   │   ├── plan.ts
│   │   ├── scheduler.ts
│   │   ├── subscription.ts
│   │   ├── team.ts
│   │   └── user.ts
│   │
│   ├── types/
│   │   ├── admin.ts
│   │   ├── ai-content.ts
│   │   ├── auth.ts
│   │   └── social-media.ts
│   │
│   └── utils/
│       ├── date.ts
│       ├── postStatusEvents.ts
│       ├── profile.ts
│       ├── stripe.ts
│       ├── text.tsx
│       └── userDetailsConstants.ts
│
├── index.html             # Vite HTML entry point
├── vite.config.ts         # Vite config (HTTPS, proxy, plugins)
├── tailwind.config.js     # Tailwind theme (brand colors, fonts)
├── tsconfig.json          # TypeScript compiler config
├── postcss.config.js      # PostCSS (Tailwind + Autoprefixer)
├── package.json
├── env.example            # Template for .env
├── Dockerfile             # Production container
├── nginx.conf             # nginx config for production container
├── docker-compose.yml     # Docker Compose for frontend
└── DEPLOYMENT_GUIDE.md    # Deployment instructions
```

---

## 4. Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Backend running (see `../startup_ninja_backend/DEVELOPER_GUIDE.md`)
- A `.env` file (copy from `env.example`)

### Install and run

```bash
cd startup_ninja_frontend
npm install
npm run dev
# App runs at https://localhost:3000
```

> **HTTPS is required.** The dev server uses `vite-plugin-mkcert` to generate a local SSL certificate automatically. This is needed because OAuth providers (Google, Microsoft, Twitter, Facebook, Instagram) require HTTPS callback URLs.

On first run, mkcert will install a local CA certificate. You may see a browser warning — click "Advanced → Proceed" once and it won't appear again.

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at `https://localhost:3000` |
| `npm run build` | TypeScript check + Vite production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | ESLint check (zero warnings policy) |

---

## 5. Environment Variables

All env vars are prefixed with `VITE_` so Vite exposes them to the browser. Copy `env.example` to `.env`.

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Yes | API Gateway base URL. Default: `http://localhost:5000/api` |
| `VITE_WEB_BUILDER_SERVICE_URL` | Yes | Website Builder service URL for direct asset access. Default: `http://localhost:3004` |
| `VITE_GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID (from Google Cloud Console) |
| `VITE_MICROSOFT_CLIENT_ID` | Yes | Microsoft Azure app client ID |
| `VITE_GOOGLE_FONTS_API_KEY` | Optional | Google Fonts API key (used in web builder font picker) |
| `VITE_WEBSITE_BUILDER_LICENSE_KEY` | Yes | GrapesJS Studio SDK license key |
| `VITE_SYSTEM_BASE_DOMAIN` | Optional | Base domain for custom website publishing. Default: `localhost` |
| `VITE_SYSTEM_IP` | Optional | Server IP for custom domain DNS instructions. Default: `127.0.0.1` |

> **Note:** Vite only exposes variables prefixed with `VITE_`. Never put secrets in frontend env vars — they are bundled into the JS and visible to anyone.

---

## 6. Configuration Files

### `vite.config.ts`

```ts
plugins: [react(), mkcert()]   // React fast refresh + local HTTPS
server: {
  https: true,
  port: 3000,
  proxy: {
    "/api": { target: "http://localhost:5000" }  // Proxy API calls to gateway
  }
}
```

The `/api` proxy means in development, `fetch('/api/auth/login')` goes to `http://localhost:5000/api/auth/login`. In production, nginx handles this routing.

### `tailwind.config.js` — Brand Colors

```js
colors: {
  primary: {
    red: '#E50000',      // Main brand red — buttons, accents, highlights
    dark: '#1A1A1A',     // Dark surface
    black: '#000000',
  },
  secondary: {
    red: '#A04040',      // Muted red for hover states
    grey: '#333333',
    lightGrey: '#4A4A4A',
    placeholder: '#888888',
  },
  text: {
    white: '#FFFFFF',
    light: '#F5F5F5',
  }
}
```

Use these tokens in components: `bg-primary-red`, `text-primary-red`, `border-secondary-grey`, etc.

The app background is `#0D0D0D` / `#07070C` (near-black), set directly in `App.tsx` and `DashboardLayout.tsx`.

### `tsconfig.json`

- Target: `ES2020`
- Strict mode enabled (`strict: true`)
- `noUnusedLocals` and `noUnusedParameters` are on — clean up unused imports
- Module resolution: `bundler` (Vite-native)

---

## 7. Routing & Route Guards

All routes are defined in `src/App.tsx`. The app uses React Router v6 with three guard types defined in `src/components/RouteGuards.tsx`.

### Guard Types

| Guard | Component | Behavior |
|---|---|---|
| Public | `<PublicRoute>` | Redirects to `/dashboard` if already authenticated |
| Protected | `<ProtectedRoute>` | Redirects to `/login` if not authenticated |
| Admin | `<AdminRoute>` | Redirects to `/login` if not authenticated or not admin role |

### Route Groups

**Public / Marketing** (no auth, uses `PublicLayout`)
```
/              → HomePage
/:page         → LandingPage (dynamic marketing sections)
/terms         → TermsOfService
/privacy       → PrivacyPolicy
/unsubscribe   → Unsubscribe (email opt-out, no auth required)
```

**Auth** (redirects to dashboard if logged in, uses `PublicRoute`)
```
/login              /register           /forgot-password
/reset-password     /verify-email       /admin/login
/buy-subscription   /payment-success
```

**Protected User** (requires login, uses `ProtectedRoute`)
```
/dashboard
/ai-tools                          /ai-tools/chat
/ai-tools/image-gen                /ai-tools/social-pro
/ai-tools/social-pro/post/:id      /ai-tools/web-builder
/ai-tools/web-builder/new-website  /ai-tools/legal
/ai-tools/legal/all-contracts      /ai-tools/legal/audit-logs
/ai-tools/legal/generate           /ai-tools/sales
/ai-tools/sales/leads              /ai-tools/sales/leads/:id
/ai-tools/sales/pipeline           /ai-tools/sales/follow-ups
/ai-tools/sales/proposals          /ai-tools/sales/projects
/ai-tools/sales/projects/:id       /ai-tools/sales/activities
/ai-tools/finance                  /ai-tools/ops
/manage-team                       /manage-team/:memberId
/settings                          /billing-history
```

**Admin** (requires admin role, uses `AdminRoute`)
```
/admin-dashboard
/admin-dashboard/users
/admin-dashboard/users/:userId
/admin-dashboard/api-management
/admin-dashboard/balance-history/:provider
/admin-dashboard/plans
```

---

## 8. Layouts

Layouts wrap pages with shared chrome (nav, sidebar, topbar). They are applied in `App.tsx` via `<Route element={<Layout>}>` wrappers.

| Layout | File | Used For |
|---|---|---|
| `PublicLayout` | `layouts/PublicLayout.tsx` | Landing/marketing pages — includes `Navbar` |
| `FrontLayout` | `layouts/FrontLayout.tsx` | Legal pages (terms, privacy) |
| `DashboardLayout` | `layouts/DashboardLayout.tsx` | All authenticated user pages |
| `AdminDashboardLayout` | `layouts/AdminDashboardLayout.tsx` | Admin pages |

### `DashboardLayout` — most important layout

Wraps every authenticated user page. It:
1. Fetches the user profile on every route change (`location.pathname` dependency)
2. Renders `DashboardSidebar` + `DashboardTopbar`
3. Renders the `Chatbot` widget (hidden on admin pages)
4. Shows `LoadingSpinner` while profile loads
5. Redirects to `/login` if profile fetch returns "User not found"

Every page that uses `DashboardLayout` receives `onLogout` as a prop — this calls `useAuth().logout()`.

---

## 9. Authentication

### How it works

1. User logs in → backend returns `{ token, refreshToken, user }`
2. `useAuth().login(user, token, refreshToken, rememberMe)` stores them:
   - `rememberMe=true` → `localStorage` (persists across browser sessions)
   - `rememberMe=false` → `sessionStorage` (cleared when tab closes)
3. `apiClient.ts` reads the token from storage and attaches `Authorization: Bearer <token>` to every request
4. On 401 response, `apiClient` automatically tries to refresh using the `refreshToken`
5. If refresh fails, `window.dispatchEvent(new Event('session-expired'))` is fired → `SessionExpiredModal` appears
6. On logout, both storages are cleared and the token is blacklisted server-side

### `useAuth` hook

```ts
const { user, token, loading, login, logout, updateUser, isAuthenticated } = useAuth();
```

- `user` — the full user object (profile, role, subscription info)
- `loading` — true while restoring session from storage on first load
- `isAuthenticated` — `!!user` (boolean)
- `updateUser(userData)` — updates user in state AND storage (used after profile edits)

The `AuthProvider` wraps the entire app in `main.tsx`. Any component can call `useAuth()`.

### OAuth flows

**Google:** `@react-oauth/google` → `GoogleSignUp.tsx` → `authService.googleLogin(credential)` → backend verifies with `google-auth-library`

**Microsoft:** `@azure/msal-react` → `MicrosoftSignUp.tsx` → MSAL popup → `authService.microsoftLogin(token)` → backend verifies with `@azure/msal-node`

**Social platforms (Twitter, Facebook, Instagram):** Use static HTML callback pages in `public/auth/` (e.g., `public/auth/twitter.html`). These pages receive the OAuth code via URL params and `postMessage` it back to the opener window.

---

## 10. API Client

**File:** `src/services/apiClient.ts`

A singleton `ApiClient` class wrapping axios. All service files use this — never create raw axios instances.

```ts
import { apiClient } from './apiClient';

// Usage
const data = await apiClient.get('/user/profile');
const result = await apiClient.post('/auth/login', { email, password });
```

### What it does automatically

| Feature | Detail |
|---|---|
| Base URL | Reads `VITE_API_BASE_URL` from env. Default: `http://localhost:5000/api` |
| Auth header | Attaches `Authorization: Bearer <token>` on every request |
| CSRF token | Fetches `/csrf-token` on init, attaches `X-CSRF-Token` on mutating requests |
| Client IP | Fetches IP from `api.ipify.org` once per session, caches in `sessionStorage`, sends as `X-User-IP` header |
| Token refresh | On 401, automatically calls `/auth/refresh-token` and retries the original request |
| Session expiry | If refresh fails, fires `session-expired` event → `SessionExpiredModal` shows |
| Timeout | 150 seconds (generous for social media post publishing) |
| Credentials | `withCredentials: true` for cookie-based CSRF |

### Error handling

The interceptor handles these status codes:
- `401` — refresh token, retry, or show session expired modal
- `403` — CSRF mismatch: refresh CSRF token and retry once
- `429` — rate limit warning logged
- `500` — server error logged

---

## 11. Services Layer

All API calls live in `src/services/`. Every function calls `apiClient.get/post/put/delete` and returns the response data directly.

### `auth.ts`

| Function | Method | Endpoint | Description |
|---|---|---|---|
| `login(email, password)` | POST | `/auth/login` | Email/password login |
| `register(data)` | POST | `/auth/register` | Create account |
| `logout(data)` | POST | `/auth/logout` | Blacklist token |
| `googleLogin(credential)` | POST | `/auth/google` | Google OAuth |
| `microsoftLogin(token)` | POST | `/auth/microsoft` | Microsoft OAuth |
| `verifyEmail(otp)` | POST | `/auth/verify-email` | Verify OTP |
| `resendOtp(email)` | POST | `/auth/resend-otp` | Resend OTP |
| `forgotPassword(email)` | POST | `/auth/forgot-password` | Send reset email |
| `resetPassword(token, password)` | POST | `/auth/reset-password` | Reset password |
| `refreshToken(token)` | POST | `/auth/refresh-token` | Refresh JWT |

### `user.ts`

| Function | Description |
|---|---|
| `getProfile()` | Get current user profile |
| `updateProfile(data)` | Update name, username, phone, country |
| `uploadProfilePicture(file)` | Upload avatar (multipart/form-data → S3) |
| `changePassword(current, new)` | Change password |
| `deleteAccount(password)` | Delete account |
| `getPreferences()` | Get language, timezone, notification settings |
| `updatePreferences(data)` | Update preferences |
| `unsubscribe(token)` | Opt out of emails (public, uses signed URL token) |
| `resubscribe()` | Re-enable email notifications |

### `plan.ts`

| Function | Description |
|---|---|
| `getCurrentPlan()` | Get user's active subscription plan + usage |
| `getAvailablePlans()` | Get all available plans for upgrade |

### `subscription.ts`

| Function | Description |
|---|---|
| `upgradePlan(planId, paymentMethodId)` | Upgrade/change subscription |
| `cancelSubscription()` | Cancel active subscription |
| `getBillingHistory()` | Get payment transaction history |

### `admin.ts`

Admin-only service. All functions require admin role.

| Function | Description |
|---|---|
| `getDashboardStats()` | Platform KPIs |
| `getUsers(filters)` | Paginated user list |
| `getUserDetails(userId)` | Full user profile + usage |
| `updateUser(userId, data)` | Update user status/role/plan |
| `addCredits(userId, amount)` | Add AI credits |
| `getAPIBalances()` | OpenAI/Gemini balance tracking |
| `getBalanceHistory(provider)` | Balance history for a provider |
| `getPlans()` | List all plans |
| `createPlan(data)` | Create a plan |
| `updatePlan(id, data)` | Update a plan |
| `deletePlan(id)` | Delete a plan |

### `services/social-media/scheduler.ts`

| Function | Description |
|---|---|
| `schedulePost(data)` | Schedule a post. Accepts `caption`, `platforms`, `accounts`, `scheduledAt`, `timezone`, `mediaFiles`. Converts local time to UTC before sending. |
| `getScheduledPosts()` | List scheduled posts |
| `cancelPost(id)` | Cancel a scheduled post |
| `getPostHistory()` | Published/failed post history |
| `getPostDetails(id)` | Single post details |

### `services/social-media/ai-content.ts`

| Function | Description |
|---|---|
| `generateCaption(prompt, platforms)` | AI-generated post caption |

### `services/web-builder/WebBuilderService.ts`

| Function | Description |
|---|---|
| `getWebsites()` | List user's websites |
| `createWebsite(data)` | Create new website project |
| `getWebsite(id)` | Get website GrapesJS JSON |
| `saveWebsite(id, data)` | Save website data |
| `deleteWebsite(id)` | Delete website |
| `publishWebsite(id)` | Publish website (generates static files) |
| `setCustomDomain(id, domain)` | Set custom domain |

### `services/web-builder/AssetService.ts`

| Function | Description |
|---|---|
| `getGallery()` | List gallery images |
| `uploadImage(file)` | Upload image to gallery |
| `deleteImage(filename)` | Delete gallery image |

### `ninja-legal.ts`

| Function | Description |
|---|---|
| `generateContract(data)` | AI contract generation |
| `getContracts()` | List contracts |
| `getContract(id)` | Get contract details |
| `updateContract(id, data)` | Update contract sections |
| `deleteContract(id)` | Delete contract |
| `getAuditLogs()` | Legal audit log |
| `checkCompliance(data)` | Run compliance check |

### `ninjaSales.ts`

Full CRUD for all CRM entities: leads, pipeline, proposals, invoices, follow-ups, tasks, activities, projects, dashboard stats, AI suggestions.

### `team.ts`

| Function | Description |
|---|---|
| `getTeamMembers()` | List team members |
| `addMember(data)` | Invite team member |
| `updateMember(id, data)` | Update permissions/role |
| `removeMember(id)` | Remove team member |

---

## 12. Pages

### Auth Pages (`src/pages/Auth/`)

| Page | File | Description |
|---|---|---|
| Login | `Login.tsx` | Email/password + Google/Microsoft OAuth |
| Register | `Register.tsx` | Multi-step registration with email verification |
| ForgotPassword | `ForgotPassword.tsx` | Send reset email |
| ResetPassword | `ResetPassword.tsx` | Set new password via token |
| VerifyEmail | `VerifyEmail.tsx` | OTP verification after registration |
| AdminLogin | `AdminLogin.tsx` | Separate admin login (no OAuth) |

### User Pages (`src/pages/User/`)

| Page | File | Description |
|---|---|---|
| Dashboard | `Dashboard.tsx` | Main hub with widgets (token usage, social insights, quick actions, recent activity) |
| AITools | `AITools.tsx` | Tool selection grid |
| AIChat | `AIChat.tsx` | Gemini-powered AI assistant chat with history |
| AIImageGen | `AIImageGen.tsx` | AI image generation with gallery |
| SocialMediaStudio | `SocialMediaStudio.tsx` | Post composer, scheduler, connected accounts |
| PostDetails | `PostDetails.tsx` | Single post detail view |
| WebBuilder | `WebBuilder.tsx` | Website list with create/edit/publish |
| NinjaLegal | `NinjaLegal.tsx` | Legal dashboard |
| NinjaFinance | `NinjaFinance.tsx` | Finance dashboard (charts, cashflow, expenses) |
| NinjaOps | `NinjaOps.tsx` | Operations dashboard (KPIs, workload, performance) |
| Settings | `Settings.tsx` | Profile, language/timezone, password, plan, billing |
| BillingHistory | `BillingHistory.tsx` | Payment transaction history |

### NinjaSales Sub-pages (`src/pages/User/NinjaSales/`)

| Page | Description |
|---|---|
| `NinjaSales.tsx` | Sales dashboard with KPIs and quick actions |
| `LeadsPage.tsx` | Leads list with filters |
| `LeadDetailsPage.tsx` | Lead detail with activities and follow-ups |
| `EditLeadPage.tsx` | Edit lead form |
| `LeadsPipelinePage.tsx` | Kanban pipeline board (drag-and-drop) |
| `FollowUpsPage.tsx` | Follow-up tasks list |
| `ProposalsPage.tsx` | Proposals list |
| `ProjectsPage.tsx` | Projects list |
| `ProjectDetailsPage.tsx` | Project detail |
| `EditProjectPage.tsx` | Edit project form |
| `DocumentDetailsPage.tsx` | Proposal/invoice document detail |
| `AllActivitiesPage.tsx` | Full activity log |

### NinjaLegal Sub-pages (`src/pages/User/NinjaLegal/`)

| Page | Description |
|---|---|
| `AllContracts.tsx` | Full contracts list |
| `AuditLogs.tsx` | Legal audit trail |
| `ContractGenerationPage.tsx` | AI contract generator |

### Admin Pages (`src/pages/Admin/`)

| Page | Description |
|---|---|
| `AdminDashboard.tsx` | Platform KPIs, charts, system alerts |
| `UserManagement.tsx` | User list with search, filter, status management |
| `UserDetails.tsx` | Full user profile, subscription, usage, activity |
| `APIManagement.tsx` | OpenAI/Gemini API balance and usage |
| `BalanceHistory.tsx` | Balance history chart for a provider |
| `PlanManagement.tsx` | Create/edit/delete subscription plans |

### Public Pages

| Page | Description |
|---|---|
| `Unsubscribe.tsx` | Email unsubscribe — handles 5 states: loading, success, already-unsubscribed, invalid token, error |
| `ComingSoon.tsx` | Placeholder for unreleased features |
| `NotFound.tsx` | 404 page |

---

## 13. Components

### Global Components

| Component | Description |
|---|---|
| `RouteGuards.tsx` | `ProtectedRoute`, `PublicRoute`, `AdminRoute` — wrap routes in `App.tsx` |
| `SessionExpiredModal.tsx` | Listens for `session-expired` event, shows modal with redirect to login |
| `LiveChatWidget.tsx` | Injects LiveChat script, syncs logged-in user identity to LiveChat |
| `ScrollToTop.tsx` | Resets scroll position on every route change |
| `AlertModal.tsx` | Generic confirm/cancel dialog — used for destructive actions |
| `NotificationModal.tsx` | Toast-style notification modal |
| `LoadingSpinner.tsx` | Full-screen or inline spinner. Props: `fullscreen`, `variant` |
| `Button.tsx` | Shared button with variants (primary, secondary, danger, ghost) |
| `Input.tsx` | Shared input with label, error state, icon support |
| `IconSelect.tsx` | Icon picker dropdown |
| `Navbar.tsx` | Top nav for public/marketing pages |
| `GoogleSignUp.tsx` | Google OAuth button using `@react-oauth/google` |
| `MicrosoftSignUp.tsx` | Microsoft OAuth button using MSAL |
| `SocialAuth.tsx` | Combined Google + Microsoft auth buttons |
| `EmailVerificationModal.tsx` | OTP input modal shown after registration |

### Dashboard Components (`components/dashboard/`)

| Component | Description |
|---|---|
| `DashboardSidebar.tsx` | Main navigation sidebar with collapsible sections |
| `DashboardTopbar.tsx` | Top bar with page title, user menu, notifications |
| `WelcomeBanner.tsx` | Personalized greeting with user name |
| `TokenUsageCard.tsx` | AI token usage progress bar with daily limit |
| `SocialInsightsCard.tsx` | Social media quick stats |
| `NinjaAssistantCard.tsx` | Quick access card to AI chat |
| `QuickActionCard.tsx` | Shortcut action buttons |
| `RecentActivityCard.tsx` | Recent user activity feed |
| `ProjectCard.tsx` | Project summary card |
| `SalesPipelineCard.tsx` | Sales pipeline snapshot |
| `LegalComplianceCard.tsx` | Legal compliance status |

### Settings Components (`components/settings/`)

| Component | Description |
|---|---|
| `ProfileIdentityForm.tsx` | Edit name, username, phone, country, profile picture upload |
| `LanguageRegionForm.tsx` | Language and timezone (IANA IDs, grouped by region) |
| `ChangePassword.tsx` | Change password form |
| `DeleteAccountForm.tsx` | Account deletion with password confirmation |
| `CurrentPlanCard.tsx` | Active plan display with usage meters |
| `PlansOverview.tsx` | Clickable plan cards → opens `PlanDetailModal` with full feature/limit breakdown |
| `PlanDetails.tsx` | Plan detail display |
| `PlanSelectionModal.tsx` | Plan selection flow |
| `UpgradePlanModal.tsx` | Upgrade confirmation with Stripe payment |
| `PaymentMethodCard.tsx` | Saved payment method display |

### Social Media Components (`components/social-media/`)

| Component | Description |
|---|---|
| `WritePostContent.tsx` | Caption editor with per-platform character count |
| `SchedulingOption.tsx` | Date/time picker with user timezone display and warning if not set |
| `FileUpload.tsx` | Media file upload with preview |
| `AccountsCard.tsx` | Connected social accounts with connect/disconnect |
| `PostsTable.tsx` | Post history table with status badges |
| `ScheduledPostsList.tsx` | Upcoming scheduled posts |
| `PostPreview.tsx` | Platform-specific post preview |
| `PublishingOverlay.tsx` | Loading overlay during post publishing |
| `PageSelectionModal.tsx` | Facebook/Instagram page picker |
| `PlatformBadge.tsx` | Platform icon + color badge |
| `PlatformTags.tsx` | Multi-platform tag display |

### AI Chat Components (`components/ai-chat/`)

| Component | Description |
|---|---|
| `AIChatComposer.tsx` | Message input with send button and file attach |
| `ChatMessage.tsx` | Single message bubble (user or AI) with markdown rendering |
| `ChatMessagesList.tsx` | Scrollable message list with auto-scroll to bottom |
| `ChatHistorySidebar.tsx` | Conversation history list with delete |
| `TypingIndicator.tsx` | Animated dots while AI is responding |
| `AIChatUpgradeBanner.tsx` | Banner shown when token limit is reached |

### Chatbot Components (`components/chatbot/`)

The Ninja Assistant chatbot widget — rendered inside `DashboardLayout` on all user pages.

| Component | Description |
|---|---|
| `Chatbot.tsx` | Main chatbot container — floating widget |
| `ChatbotComposer.tsx` | Message input |
| `ChatbotMessages.tsx` | Message list |
| `ChatbotHeader.tsx` | Widget header with minimize/close |
| `ChatbotQuickPrompts.tsx` | Suggested quick-start prompts |
| `ChatHistoryPanel.tsx` | Conversation history panel |

---

## 14. Hooks

### `useAuth` — `src/hooks/useAuth.tsx`

The most important hook. Provides the auth context to the entire app.

```ts
const {
  user,            // Current user object (null if not logged in)
  token,           // JWT string
  loading,         // true while restoring session from storage
  isAuthenticated, // boolean shorthand
  login,           // (userData, token, refreshToken?, rememberMe?) => void
  logout,          // () => Promise<void>
  updateUser,      // (userData) => void — updates state + storage
} = useAuth();
```

**Important:** `user` is typed as `any` — the actual shape includes `id`, `email`, `fullname`, `username`, `role`, `profilePicture`, `country`, `phoneNumber`, `isEmailVerified`, `addedBy` (for team members), `permissions`.

### `useUserTimezone` — `src/hooks/useUserTimezone.ts`

Returns the user's IANA timezone string (e.g., `"America/New_York"`).

```ts
const timezone = useUserTimezone();
// Returns: "America/New_York" | "Europe/London" | etc.
```

Read order:
1. `localStorage` key `userTimezone` (set on settings save — instant, no API call)
2. Falls back to API call `GET /user/preferences`
3. Falls back to browser's `Intl.DateTimeFormat().resolvedOptions().timeZone`

Used by `SchedulingOption.tsx` to display and convert scheduled post times.

### `useAdminData` — `src/hooks/useAdminData.ts`

Fetches and caches admin dashboard data (stats, users, API balances). Used by admin page components.

---

## 15. Utils & Constants

### `src/utils/date.ts`

| Function | Description |
|---|---|
| `buildUTCFromTimezone(date, time, tz)` | Converts a local date + time string in a given IANA timezone to a UTC ISO string. Used before sending scheduled post times to the API. |
| `formatInTimezone(utcDate, tz)` | Formats a UTC date string as a human-readable local time in the given timezone. |

### `src/utils/profile.ts`

| Function | Description |
|---|---|
| `resolveProfilePictureUrl(path)` | Resolves a profile picture path to a full URL (handles S3 URLs, relative paths, and null → default avatar) |
| `getInitials(name)` | Returns 1-2 letter initials from a full name |

### `src/utils/text.tsx`

| Function | Description |
|---|---|
| `truncate(str, maxLen)` | Truncates a string with ellipsis |
| `markdownToPlainText(md)` | Strips markdown syntax for plain text previews |

### `src/utils/postStatusEvents.ts`

A browser `EventTarget`-based event emitter for real-time post status updates. The `postStatusPoller` service polls the API and emits events that `PostsTable` and `ScheduledPostsList` listen to.

### `src/utils/stripe.ts`

Loads the Stripe.js script and returns the Stripe instance. Used by `StripeWrapper.tsx`.

### `src/utils/userDetailsConstants.ts`

Dropdown option arrays for user detail forms (department options, team role options, permission labels).

### `src/constants/platforms.ts`

```ts
// Each platform entry:
{
  id: 'linkedin',
  label: 'LinkedIn',
  color: '#0A66C2',
  maxChars: 3000,
  icon: LinkedInIcon,
}
```

Platforms: `linkedin`, `twitter`, `facebook`, `instagram`.

### `src/constants/timezones.ts`

Array of 30+ timezone entries:
```ts
{ id: 'America/New_York', label: 'Eastern Time (ET)', offset: 'UTC-5', region: 'Americas' }
```

Also exports `LEGACY_TIMEZONE_MAP` for backward compatibility with old string-based timezone values stored in the database (e.g., `"EST"` → `"America/New_York"`).

### `src/data/countries.ts`

Array of `{ code, name }` objects for all countries. Used in registration and profile forms.

### `src/lib/msalConfig.ts`

Microsoft MSAL configuration:
```ts
{
  auth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
    redirectUri: window.location.origin,
  }
}
```

---

## 16. Styling Guide

### Approach

Tailwind CSS utility classes are used throughout. No CSS modules, no styled-components. Custom styles go in `src/index.css`.

### Brand Colors (use Tailwind tokens)

| Token | Hex | Use |
|---|---|---|
| `primary-red` / `#E50000` | `#E50000` | Primary buttons, active states, brand accents |
| `#DE0500` / `#EC2222` | — | Used directly in inline styles for gradients |
| `#0D0D0D` | — | App background (set directly, not a token) |
| `#07070C` | — | Dashboard background |
| `#1A1A1A` | `primary-dark` | Card backgrounds |
| `#333333` | `secondary-grey` | Borders, dividers |
| `#888888` | `secondary-placeholder` | Placeholder text |

### Typography

Font: **Plus Jakarta Sans** (loaded from Google Fonts in `index.css`). Set as the default `font-family` on `body`.

Tailwind typography plugin (`@tailwindcss/typography`) is used for AI chat markdown rendering — apply the `prose` class to markdown containers.

### Common Patterns

```tsx
// Card
<div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-4">

// Primary button
<button className="bg-primary-red hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">

// Input
<input className="bg-[#0D0D0D] border border-[#333] text-white rounded-lg px-3 py-2 focus:border-primary-red focus:outline-none">

// Section heading
<h2 className="text-white font-semibold text-lg">

// Muted text
<p className="text-gray-400 text-sm">
```

### Custom Scrollbars

`index.css` defines several scrollbar styles:
- `.custom-scrollbar` — standard dark scrollbar for dashboard pages
- `.chat-messages-scrollbar` — red-on-hover for AI chat
- `.chat-history-scrollbar` — red-on-hover for chat history
- `.notification-scroll` — thin scrollbar for notification panels
- `.hide-scrollbar` — hides scrollbar while keeping scroll functionality

### Animations

Defined in `index.css`:
- `animate-slideUp` — slides element up from below (landing page hero)
- `animate-zoomIn` — zoom in from slightly larger (background images)
- `ninja-spinner` — custom loading spinner rotation

---

## 17. Third-Party Integrations

### Google OAuth

- Package: `@react-oauth/google`
- Component: `GoogleSignUp.tsx` wraps `<GoogleLogin>` from the package
- Provider: `<GoogleOAuthProvider clientId={...}>` in `main.tsx`
- Flow: Google returns a credential token → `authService.googleLogin(credential)` → backend verifies

### Microsoft OAuth (MSAL)

- Packages: `@azure/msal-browser`, `@azure/msal-react`
- Config: `src/lib/msalConfig.ts`
- Provider: `<MsalProvider instance={msalInstance}>` in `main.tsx`
- Component: `MicrosoftSignUp.tsx` uses `useMsal()` hook to trigger popup login

### Stripe

- Packages: `@stripe/react-stripe-js`, `@stripe/stripe-js`
- Wrapper: `components/payment/StripeWrapper.tsx` — loads Stripe and provides `<Elements>` context
- Payment component: `components/subscription/PaymentStep.tsx` — renders `<CardElement>`
- Flow: Frontend creates a payment intent via `subscriptionService` → Stripe confirms → backend webhook handles fulfillment

### GrapesJS Studio SDK

- Package: `@grapesjs/studio-sdk`
- Component: `components/web-builder/WebsiteBuilderStudio.tsx`
- License key: `VITE_WEBSITE_BUILDER_LICENSE_KEY`
- The SDK renders a full no-code editor. Website data is saved as GrapesJS JSON to the website builder service.
- Custom CSS overrides for the GrapesJS UI are in `index.css` (all `.gs-*` selectors)

### LiveChat

- Component: `components/LiveChatWidget.tsx`
- License: `19730364`
- Injects the LiveChat tracking script once on mount
- Automatically passes logged-in user's name and email to LiveChat so agents see visitor identity
- To change the button/widget color: LiveChat dashboard → Settings → Chat widget → Customization → Theme color → `#DE0500`

### React Markdown + Highlight.js

- Packages: `react-markdown`, `rehype-highlight`, `remark-gfm`
- Used in: `ChatMessage.tsx`, `ChatbotMessages.tsx`
- Renders AI responses as formatted markdown with syntax-highlighted code blocks
- Code block styles: `index.css` `.hljs` overrides for dark theme

### Drag and Drop (Kanban)

- Package: `@hello-pangea/dnd`
- Used in: `components/ninja-sales/PipelineKanban.tsx`
- Provides `<DragDropContext>`, `<Droppable>`, `<Draggable>` for the sales pipeline board

### PDF Export

- Packages: `jspdf`, `html2canvas`
- Used in: contract and proposal export features
- `html2canvas` screenshots the DOM element → `jsPDF` embeds it as a PDF page

---

## 18. Docker & Deployment

### Development with Docker

```bash
docker-compose -f docker-compose.dev.yml up --build
# Frontend available at http://localhost:3000
```

### Production build

```bash
npm run build
# Output in dist/
```

### Production Docker

```bash
docker-compose up --build
```

The production container uses **nginx** (`nginx.conf`) to:
- Serve the `dist/` static files
- Handle SPA routing (all routes → `index.html`)
- Proxy `/api/*` requests to the API Gateway

### `nginx.conf` key rules

```nginx
location / {
  try_files $uri $uri/ /index.html;  # SPA fallback
}

location /api/ {
  proxy_pass http://api-gateway:5000;  # Proxy to backend
}
```

### Environment in production

Set env vars at build time (Vite bakes them into the bundle):
```bash
VITE_API_BASE_URL=https://api.yourdomain.com/api npm run build
```

Or use a `.env.production` file.

---

## 19. Key Patterns & Conventions

### File naming

- Components: `PascalCase.tsx` (e.g., `DashboardSidebar.tsx`)
- Hooks: `camelCase.ts` prefixed with `use` (e.g., `useUserTimezone.ts`)
- Services: `camelCase.ts` (e.g., `ninjaSales.ts`)
- Utils/constants: `camelCase.ts` (e.g., `timezones.ts`)

### Component structure

```tsx
// 1. Imports
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

// 2. Types/interfaces
interface Props { ... }

// 3. Component
export default function MyComponent({ prop }: Props) {
  // 4. Hooks at the top
  const { user } = useAuth();
  const [state, setState] = useState(...);

  // 5. Effects
  useEffect(() => { ... }, []);

  // 6. Handlers
  const handleClick = () => { ... };

  // 7. Render
  return ( ... );
}
```

### API calls in components

Always call services from `useEffect` or event handlers — never at the top level:

```tsx
useEffect(() => {
  const load = async () => {
    try {
      const data = await userService.getProfile();
      setProfile(data.user);
    } catch (err) {
      toast.error('Failed to load profile');
    }
  };
  load();
}, []);
```

### Toast notifications

Use `react-hot-toast` for all user feedback:

```tsx
import toast from 'react-hot-toast';

toast.success('Saved successfully');
toast.error('Something went wrong');
toast.loading('Saving...');
```

The `<Toaster>` is configured in `App.tsx` with dark theme styling.

### Form handling

Use `react-hook-form` for all forms:

```tsx
import { useForm } from 'react-hook-form';

const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

const onSubmit = async (data: FormData) => { ... };

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <input {...register('email', { required: 'Email is required' })} />
    {errors.email && <span>{errors.email.message}</span>}
  </form>
);
```

### Timezone handling

Always store and send times in UTC. Convert to/from local time using the utilities:

```ts
import { buildUTCFromTimezone } from '../utils/date';
import { useUserTimezone } from '../hooks/useUserTimezone';

const timezone = useUserTimezone();
const utcTime = buildUTCFromTimezone('2024-12-25', '14:30', timezone);
// Send utcTime to the API
```

### Team member detection

Team members (added by an admin user) have `user.addedBy` set. Check this to conditionally hide settings:

```tsx
const isTeamMember = !!user?.addedBy;
// Hide billing, plan upgrade, delete account for team members
```

---

*Last updated: May 2026*
