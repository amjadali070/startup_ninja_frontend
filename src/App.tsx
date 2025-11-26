import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import PublicLayout from "./layouts/PublicLayout";
import Login from "./pages/Auth/Login.tsx";
import Register from "./pages/Auth/Register.tsx";
import Dashboard from "./pages/User/Dashboard.tsx";
import AdminLogin from "./pages/Auth/AdminLogin.tsx";
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
import HomePage from "./pages/HomePage.tsx";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/Admin/AdminDashboard.tsx";
import WebBuilder from "./pages/User/WebBuilder.tsx";
import WebsiteBuilderStudio from "./components/web-builder/WebsiteBuilderStudio.tsx";
import Products from "./pages/Products.tsx";
import Solutions from "./pages/Solutions.tsx";
import Developers from "./pages/Developers.tsx";
import Resources from "./pages/Resources.tsx";
import PricingPage from "./pages/PricingPage.tsx";
import BookADemo from "./pages/BookADemo.tsx";
import ContactUs from "./pages/ContactUs.tsx";
import Documentation from "./pages/Documentation.tsx";
import TermsCondition from "./pages/TermsCondition.tsx";
import LatestNewsPage from "./pages/LatestNewsPage.tsx";
import BusinessPage from "./pages/BusinessPage.tsx";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0D0D0D]">
        <ScrollToTop />
        <Routes>
          {/* Public Routes with Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/book-demo" element={<BookADemo />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/terms" element={<TermsCondition />} />
            <Route path="/latest-news" element={<LatestNewsPage />} />
            <Route path="/business" element={<BusinessPage />} />
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
            path="/admin/login"
            element={
              <PublicRoute>
                <AdminLogin />
              </PublicRoute>
            }
          />

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

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
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
      </div>
    </AuthProvider>
  );
}

export default App;
