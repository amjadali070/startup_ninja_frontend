import { Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login.tsx';
import Register from './pages/Auth/Register.tsx';
import Dashboard from './pages/User/Dashboard.tsx';
import AdminLogin from './pages/Auth/AdminLogin.tsx';
import AIChat from './pages/User/AIChat.tsx';
import AIImageGen from './pages/User/AIImageGen.tsx';
import SocialMediaStudio from './pages/User/SocialMediaStudio.tsx';
import AITools from './pages/User/AITools.tsx';
import { ProtectedRoute, PublicRoute } from './components/RouteGuards';
import { AuthProvider } from './hooks/useAuth.tsx';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage.tsx';
import Settings from './pages/Settings';


function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0D0D0D]">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicRoute>
              <HomePage />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="/admin/login" element={
            <PublicRoute>
              <AdminLogin />
            </PublicRoute>
          } />
          
          {/* Protected User Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/ai-tools" element={
            <ProtectedRoute>
              <AITools />
            </ProtectedRoute>
          } />
          <Route path="/ai-tools/:toolId" element={
            <ProtectedRoute>
              <AITools />
            </ProtectedRoute>
          } />
          <Route path="/ai-tools/chat" element={
            <ProtectedRoute>
              <AIChat />
            </ProtectedRoute>
          } />
          <Route path="/ai-tools/image-gen" element={
            <ProtectedRoute>
              <AIImageGen />
            </ProtectedRoute>
          } />
          <Route path="/ai-tools/social-pro" element={
            <ProtectedRoute>
              <SocialMediaStudio />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
        </Routes>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1A1A1A',
              color: '#fff',
              border: '1px solid #333',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </AuthProvider>
  );
}

export default App;
