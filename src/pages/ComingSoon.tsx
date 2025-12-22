import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiClock } from 'react-icons/fi';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../hooks/useAuth';

interface ComingSoonProps {
  title: string;
  description?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ 
  title, 
  description = "We are working hard to bring you this feature. Stay tuned!" 
}) => {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <DashboardLayout 
      title={title} 
      activePath={location.pathname}
      onLogout={logout}
    >
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center p-4 text-center">
        <div className="mb-8 rounded-full bg-gradient-to-br from-red-500/10 to-red-900/10 p-8 ring-1 ring-white/10">
          <FiClock className="h-16 w-16 text-red-500 animate-pulse" />
        </div>
        
        <h1 className="mb-4 font-plus-jakarta text-4xl font-bold text-white md:text-5xl">
          <span className="text-red-500">{title}</span> Coming Soon
        </h1>
        
        <p className="mb-8 max-w-md text-lg text-gray-400">
          {description}
        </p>
        
        <Link 
          to="/dashboard" 
          className="group inline-flex items-center gap-2 rounded-xl bg-white/5 py-3 px-6 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:shadow-lg hover:shadow-red-500/10"
        >
          <FiArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default ComingSoon;
