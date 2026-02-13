# Startup Ninja Frontend

A modern React frontend for the Startup Ninja authentication system.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Setup environment**:

   ```bash
   cp env.example .env
   # Update .env with your API base URL
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Features

- **Modern UI**: Built with React 18 and TypeScript
- **Responsive Design**: Tailwind CSS with custom brand colors
- **Authentication**: Login, Register, Google OAuth, and Forgot Password pages
- **Type Safety**: Full TypeScript support
- **Fast Development**: Vite for lightning-fast builds

## 🎨 Brand Colors

The application uses a custom color palette based on the Startup Ninja brand:

- **Primary Red**: `#E50000` - Main brand color
- **Secondary Red**: `#A04040` - Accent color
- **Dark Background**: `#1A1A1A` - Primary background
- **Black**: `#000000` - Deep background
- **Grey**: `#333333` - UI elements
- **Light Grey**: `#4A4A4A` - Secondary UI elements
- **Placeholder**: `#888888` - Placeholder text
- **White**: `#FFFFFF` - Text color

## 📁 Project Structure

```text
src/
├── components/          # Reusable UI components
│   ├── Button.tsx       # Custom button component
│   ├── Input.tsx        # Custom input component
│   └── Navbar.tsx       # Navigation component
├── pages/               # Authentication pages
│   ├── Login.tsx        # Login page
│   ├── Register.tsx     # Registration page
│   └── ForgotPassword.tsx # Password reset page
├── services/            # API service calls
│   └── auth.ts          # Authentication API calls
├── hooks/               # Custom React hooks
│   └── useAuth.tsx      # Authentication provider + hook
├── types/               # TypeScript type definitions
│   └── auth.ts          # Authentication types
├── App.tsx              # Main app component
├── main.tsx             # React entry point
└── index.css            # Global styles
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

## 🔐 Google Sign-In

- Configure OAuth credentials in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- Allowed JavaScript origin: `http://localhost:3000`
- Allowed redirect URI: `http://localhost:3001/auth/google/callback`
- Copy the client ID into both the frontend (`VITE_GOOGLE_CLIENT_ID`) and backend (`GOOGLE_CLIENT_ID`) `.env` files
- The `<GoogleSignUp />` component lives in `src/components/GoogleSignUp.tsx`
- All Google sign-in flows finish by calling the backend endpoint `POST /auth/google`

## 🔗 API Integration

The frontend integrates with the Startup Ninja backend API:

- **Base URL**: Configured via `VITE_API_BASE_URL`
- **Authentication**: JWT token-based authentication
- **Endpoints**: `POST /auth/register`, `POST /auth/login`, `POST /auth/google`, `POST /auth/forgot-password`

## 🎯 Pages

### Login Page (`/login`)

- Email/password login
- Google OAuth sign-in
- Form validation and error handling

### Register Page (`/register`)

- Name, email, and password input
- Google sign-up button
- Password confirmation and validation
- Success/error feedback

### Dashboard Page (`/dashboard`)

- Protected page that requires a valid JWT
- Loads the authenticated user's profile via `GET /user/profile`
- Demonstrates how `apiClient` attaches the stored JWT to outgoing requests

### Forgot Password Page (`/forgot-password`)

- Email input for password reset
- Success message after email sent
- Link back to login

## 🛠️ Development

### Adding New Components

1. Create component in `src/components/`
2. Export from component file
3. Import and use in pages

### Styling

- Use Tailwind CSS classes
- Custom colors available via theme configuration
- Responsive design with mobile-first approach

### TypeScript

- All components are fully typed
- API responses are typed in `src/types/`
- Custom hooks include proper typing

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Security

- Input validation on all forms
- Secure token storage in localStorage
- CORS-compliant API calls
- XSS protection through React

## 📄 License

MIT License - see LICENSE file for details.
