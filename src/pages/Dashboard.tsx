import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { userService, UserProfile } from '../services/user';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchProfile = async () => {
      const response = await userService.getProfile();
      if (response.success && response.user) {
        setProfile(response.user);
      } else {
        setError(response.message || 'Unable to load profile.');
      }
      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-black text-text-white flex items-center justify-center">
        <p>Loading your dashboard…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary-black text-text-white flex items-center justify-center">
        <div className="max-w-md w-full px-6">
          <h1 className="text-2xl font-semibold mb-4">Something went wrong</h1>
          <p className="mb-6 text-red-400">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full h-[44px] bg-[#E50000] hover:bg-[#CC0000] rounded-[8px] text-white text-sm font-semibold tracking-wide transition-colors duration-200"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-primary-black text-text-white px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            {profile.profilePicture && (
              <img
                src={profile.profilePicture}
                alt={profile.username || profile.email}
                className="w-14 h-14 rounded-full object-cover border border-[#222222]"
              />
            )}
            <div>
            <p className="text-sm uppercase tracking-widest text-[#888888]">Welcome back</p>
            <h1 className="text-3xl font-semibold mt-2">{profile.username || profile.email}</h1>
            <p className="text-sm text-[#BBBBBB] mt-1">You're viewing a secure route powered by your JWT.</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="h-[40px] px-6 bg-[#333333] hover:bg-[#404040] rounded-[8px] text-sm font-medium transition-colors duration-200"
          >
            Log out
          </button>
        </header>

        <section className="bg-[#111111] border border-[#222222] rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#888888] uppercase text-xs tracking-widest mb-1">Email</p>
              <p>{profile.email}</p>
            </div>
            <div>
              <p className="text-[#888888] uppercase text-xs tracking-widest mb-1">Username</p>
              <p>{profile.username}</p>
            </div>
            <div>
              <p className="text-[#888888] uppercase text-xs tracking-widest mb-1">Account created</p>
              <p>{new Date(profile.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[#888888] uppercase text-xs tracking-widest mb-1">Last updated</p>
              <p>{new Date(profile.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </section>

        <section className="bg-[#111111] border border-[#222222] rounded-2xl p-6 space-y-3 text-sm">
          <h2 className="text-xl font-semibold">Authenticated Request Example</h2>
          <p className="text-[#BBBBBB]">
            The data above comes from <code className="bg-[#1E1E1E] px-1 py-0.5 rounded">GET /user/profile</code>,
            fetched with the JWT stored in <code className="bg-[#1E1E1E] px-1 py-0.5 rounded">localStorage</code>.
            The token is automatically attached to every request via <code className="bg-[#1E1E1E] px-1 py-0.5 rounded">apiClient</code>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
