
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AIChat from './pages/AIChat';
import AIImageGen from './pages/AIImageGen';
import SocialMediaStudio from './pages/SocialMediaStudio';
import AITools from './pages/AITools';
import { ProtectedRoute, PublicRoute } from './components/RouteGuards';
import { AuthProvider } from './hooks/useAuth.tsx';
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0D0D0D] font-sans">
        <Routes>
          <Route path="/" element={
            <PublicRoute>
              <Login />
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

export default App


