
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
      </div>
    </AuthProvider>
  );
}

export default App


