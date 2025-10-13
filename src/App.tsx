import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <div className="min-h-screen bg-primary-black">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
  <Route path="/dashboard" element={<Dashboard />} />
        {/* Forgot Password route temporarily disabled */}
      </Routes>
    </div>
  )
}

export default App