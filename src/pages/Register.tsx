import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import GoogleSignUp from '../components/GoogleSignUp';
import { authService } from '../services/auth';
import { RegisterRequest, AuthResponse } from '../types/auth';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register(formData);
      if (response.success && response.token && response.user) {
        login(response.user, response.token);
        navigate('/dashboard');
      } else if (response.success) {
        navigate('/login', { 
          state: { message: 'Registration successful! Please log in.' } 
        });
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (response: AuthResponse) => {
    setError('');
    if (response.token && response.user) {
      login(response.user, response.token);
      navigate('/dashboard');
    }
  };

  const handleGoogleError = (message: string) => {
    setError(message);
  };

  return (
    <div className="min-h-screen bg-primary-black flex">
      {/* Left Side - Register Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex items-center justify-center mb-8">
              <div className="text-primary-red font-bold text-3xl">
                STARTUP
              </div>
              <div className="text-primary-red font-bold text-3xl flex items-center ml-2">
                NINJA
                <span className="ml-1 text-text-white text-2xl">🥷</span>
              </div>
            </div>
            <h2 className="text-center text-2xl font-bold text-text-white">
              Create your account
            </h2>
          </div>
          
          <GoogleSignUp
            className="w-full"
            onAuthSuccess={handleGoogleSuccess}
            onAuthError={handleGoogleError}
          />

          <div className="flex items-center mt-6">
            <div className="flex-1 h-px bg-[#333333]"></div>
            <span className="px-3 text-[#888888] text-xs uppercase tracking-widest">Or continue with email</span>
            <div className="flex-1 h-px bg-[#333333]"></div>
          </div>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                required
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@host.com"
                required
              />
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating account...' : 'CREATE ACCOUNT'}
            </Button>

            <div className="text-center">
              <span className="text-secondary-placeholder">
                Already have an account?{' '}
              </span>
              <Link
                to="/login"
                className="text-primary-red hover:text-red-400 transition-colors duration-200"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Background Image */}
      <div className="hidden lg:block lg:w-2/3 bg-gradient-to-br from-primary-black via-secondary-red to-primary-red relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-text-white">
            <div className="text-6xl mb-4">🚀</div>
            <h1 className="text-4xl font-bold mb-4">Join the Ninja Community</h1>
            <p className="text-xl opacity-80">
              Start your entrepreneurial journey today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
