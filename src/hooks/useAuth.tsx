import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authService } from '../services/auth';

// Replace 'any' with your actual user type if available
export type User = any;

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (userData: User, token: string, refreshToken?: string) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData: User, token: string, refreshToken?: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    setToken(token);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (user?.id) {
        const userData = { user: { userId: user.id } };
        await authService.logout(userData);
      } else {
        // If no user ID, still try to call logout to clear backend session if token exists
        // The service expects an object with user.userId, so we'll pass a dummy one or handle it
        // But since we have the token, the backend should be able to identify the session.
        // Let's pass a dummy object to satisfy the typescript definition if needed, 
        // or better, just pass what we have.
        // Actually, looking at authService.logout signature: userData: { user: { userId: string } }
        // We should try to pass it if possible.
        await authService.logout({ user: { userId: user?.id || '' } });
      }
    } catch (error) {
      console.error('AuthProvider logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
