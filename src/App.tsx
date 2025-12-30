import { Routes, Route, Outlet } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import PublicLayout from "./layouts/PublicLayout";
import FrontLayout from "./layouts/FrontLayout";
import Login from "./pages/Auth/Login.tsx";
import Register from "./pages/Auth/Register.tsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.tsx";
import ResetPassword from "./pages/Auth/ResetPassword.tsx";
import VerifyEmail from "./pages/Auth/VerifyEmail.tsx";
import TermsOfService from "./pages/Legal/TermsOfService.tsx";
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy.tsx";
import NotFound from "./pages/NotFound.tsx";
import Dashboard from "./pages/User/Dashboard.tsx";
import AdminLogin from "./pages/Auth/AdminLogin.tsx";
import BuySubscription from "./pages/Subscription/BuySubscription.tsx";
import AIChat from "./pages/User/AIChat.tsx";
import AIImageGen from "./pages/User/AIImageGen.tsx";
import SocialMediaStudio from "./pages/User/SocialMediaStudio.tsx";
import PostDetails from "./pages/User/PostDetails.tsx";
import AITools from "./pages/User/AITools.tsx";
import {
  AdminRoute,
  ProtectedRoute,
  PublicRoute,
} from "./components/RouteGuards";
import { AuthProvider } from "./hooks/useAuth.tsx";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/landing-page/HomePage.tsx";
import LandingPage from "./pages/landing-page/LandingPage.tsx";
import Settings from "./pages/User/Settings.tsx";
import BillingHistory from "./pages/User/BillingHistory.tsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.tsx";
import UserManagement from "./pages/Admin/UserManagement.tsx";
import APIManagement from "./pages/Admin/APIManagement.tsx";
import BalanceHistory from "./pages/Admin/BalanceHistory.tsx";
import WebBuilder from "./pages/User/WebBuilder.tsx";
import WebsiteBuilderStudio from "./components/web-builder/WebsiteBuilderStudio.tsx";
import SessionExpiredModal from "./components/SessionExpiredModal.tsx";
import UserDetailsPage from "./pages/Admin/UserDetails.tsx";
import PlanManagement from "./pages/Admin/PlanManagement.tsx";
import ComingSoon from "./pages/ComingSoon.tsx";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0D0D0D]">
        <ScrollToTop />
        <Routes>
          {/* Public Routes with Layout (Restricted to non-authenticated users) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/:page" element={<LandingPage />} />
          </Route>

          {/* Legal Routes (Accessible to everyone) */}
          <Route
            element={
              <FrontLayout>
                <Outlet />
              </FrontLayout>
            }
          >
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Route>

          {/* Auth Routes (No Layout) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              <PublicRoute>
                <VerifyEmail />
              </PublicRoute>
            }
          />
          <Route
            path="/admin/login"
            element={
              <PublicRoute>
                <AdminLogin />
              </PublicRoute>
            }
          />
          <Route path="/buy-subscription" element={<BuySubscription />} />

          {/* Protected User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ComingSoon title="Projects" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/templates"
            element={
              <ProtectedRoute>
                <ComingSoon title="Templates" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <ComingSoon title="Community Feed" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools"
            element={
              <ProtectedRoute>
                <AITools />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/:toolId"
            element={
              <ProtectedRoute>
                <AITools />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/chat"
            element={
              <ProtectedRoute>
                <AIChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/image-gen"
            element={
              <ProtectedRoute>
                <AIImageGen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/social-pro"
            element={
              <ProtectedRoute>
                <SocialMediaStudio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/social-pro/post/:id"
            element={
              <ProtectedRoute>
                <PostDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/web-builder"
            element={
              <ProtectedRoute>
                <WebBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-tools/web-builder/new-website"
            element={
              <ProtectedRoute>
                <WebsiteBuilderStudio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing-history"
            element={
              <ProtectedRoute>
                <BillingHistory />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin-dashboard/users"
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin-dashboard/users/:userId"
            element={
              <AdminRoute>
                <UserDetailsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin-dashboard/api-management"
            element={
              <AdminRoute>
                <APIManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin-dashboard/balance-history/:provider"
            element={
              <AdminRoute>
                <BalanceHistory />
              </AdminRoute>
            }
          />
          <Route
            path="/admin-dashboard/plans"
            element={
              <AdminRoute>
                <PlanManagement />
              </AdminRoute>
            }
          />

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1A1A1A",
              color: "#fff",
              border: "1px solid #333",
              fontSize: "12px",
              width: "auto",
              maxWidth: "100%",
            },
            success: {
              iconTheme: {
                primary: "#10B981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#EF4444",
                secondary: "#fff",
              },
            },
          }}
        />
        <SessionExpiredModal />
      </div>
    </AuthProvider>
  );
}

export default App;
