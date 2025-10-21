import { useEffect, useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout.tsx';
import { useAuth } from '../../hooks/useAuth.tsx';
import { authService } from '../../services/auth.ts';
import CreateWebsiteModal from '../../components/web-builder/CreateWebsiteModal.tsx';
import { FiCheckCircle, FiEdit2, FiEye, FiGlobe, FiMinusCircle} from 'react-icons/fi';
import { BiPlus } from 'react-icons/bi';

const WebBuilder: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Social Media Studio logout failed:', err);
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const handleOpenSettings = () => {
    navigate('/settings');
  };
  const recentWebsites = [
    {
      id: 1,
      title: 'Reteck Website Design',
      subtitle: 'Business & Investor Landing',
      image: '/images/website-demo.png',
      status: 'Published',
      views: 8,
      date: '2d ago',
    },
    {
      id: 2,
      title: 'Hexeo Landing Page',
      subtitle: 'Database & API Service',
      image: '/images/website-demo.png',
      status: 'Published',
      views: 5,
      date: '1d ago',
    },
    {
      id: 3,
      title: 'Neon Labs Landing Page',
      subtitle: 'SaaS & Technology Startup',
      image: '/images/website-demo.png',
      status: 'Draft',
      views: 12,
      date: '3d ago',
    },
    {
      id: 4,
      title: 'Neonix Website',
      subtitle: 'AI & Marketing Portfolio',
      image: '/images/website-demo.png',
      status: 'Published',
      views: 2,
      date: '2d ago',
    },
  ];


  return (
    <DashboardLayout
      activePath="/ai-tools/web-builder"
      title="Social Media Studio"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto">
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="mb-6">
            <section className="relative w-full overflow-hidden rounded-[16px] border border-black bg-[url('/images/welcome-bg.png')] bg-cover bg-center bg-no-repeat border-[#ff3b3b47]">
              <div className="absolute inset-0 bg-[#f5212e0d]" />
              <div className="relative z-10 flex h-full flex-col justify-between gap-3 px-3 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-4 sm:py-5 md:px-6 md:py-6 xl:px-8 xl:py-8">
                <div className="flex-1 min-w-0">
                  <h2 className="font-plus-jakarta w-full text-xl font-bold leading-7 text-white sm:text-2xl sm:leading-[32px] md:text-[26px] md:leading-[36px]">
                    Start Building Your Website
                  </h2>
                  <p className="font-plus-jakarta mt-1 text-xs leading-5 text-gray-300 sm:mt-2 sm:text-sm sm:leading-6 md:text-[16px] md:leading-[24px]">
                    Choose a template or start from scratch, our AI builds your website in minutes.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button type="button" onClick={() => setIsModalOpen(true)}
                    className="font-plus-jakarta inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#DC2626] to-[#B91C1C] px-3 py-2 text-xs font-medium text-white transition-all duration-200 hover:shadow-lg sm:px-4 sm:py-2.5 sm:text-sm">
                    <BiPlus className="h-4 w-4" />
                    <span>Start New Website</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
          {/* Recent Websites Section */}
          <div className="mt-10">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
              Your Recent Websites
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Manage and track all your created websites
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {recentWebsites.map((site) => (
                <div key={site.id} className="group relative bg-[#121212] border border-[#2c2c2c] rounded-xl overflow-hidden transition-all duration-300">
                  {/* Hover Overlay Gradient */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
                    style={{
                      background: "linear-gradient(131deg, #81000057, rgb(0 0 0 / 30%)), linear-gradient(167.91deg, rgba(129, 0, 0, 0.5) 27.29%, rgba(58, 0, 0, 0.5) 45.33%, rgba(29, 0, 0, 0.25) 87.42%, rgb(220 65 220 / 50%) 123.5%)",
                    }}/>

                  {/* Content should be above the overlay */}
                  <div className="relative z-10">
                    {/* Thumbnail */}
                    <img src={site.image} alt={site.title} className="w-full h-40 object-cover" />

                    {/* Info */}
                    <div className="p-4">
                      <h4 className="text-white font-semibold text-base flex items-center gap-2">
                        {site.title}
                      </h4>
                      <p className="text-gray-400 text-sm mb-2">{site.subtitle}</p>

                      <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                        {/* Status Icon + Label */}
                        <span className={`flex items-center gap-1 font-medium ${site.status === 'Published' ? 'text-green-500' : 'text-red-500'
                            }`}>
                          {site.status === 'Published' ? (
                            <FiCheckCircle className="w-4 h-4" />
                          ) : (
                            <FiMinusCircle className="w-4 h-4" />
                          )}
                          {site.status}
                        </span>

                        {/* Views */}
                        <span className="flex items-center gap-1">
                          <FiEye className="w-4 h-4" />
                          {site.views}
                        </span>

                        {/* Date */}
                        <span>{site.date}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button title="Edit Website"
                          onClick={() => window.open(`/ai-tools/web-builder/new-website`, '_blank', 'noopener,noreferrer')}
                          className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] hover:shadow-lg text-white text-sm font-medium px-3 py-2 rounded-md">
                          <FiEdit2 className="w-4 h-4" />
                          Edit Website
                        </button>

                        <button title="Preview Staging Website" className="bg-[#2e2e2e] text-white p-2 rounded-md hover:bg-[#3a3a3a]">
                          <FiEye className="w-4 h-4" />
                        </button>

                        <button title="Preview Published Website" className="bg-[#2e2e2e] text-white p-2 rounded-md hover:bg-[#3a3a3a]">
                          <FiGlobe className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <CreateWebsiteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
      </main>
    </DashboardLayout>
  );
};
export default WebBuilder;