import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center p-4 text-center font-plus-jakarta">
      <div className="space-y-6 max-w-lg">
        {/* Animated 404 text or graphic */}
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#DC2626] to-[#7F1D1D] opacity-80 select-none">
          404
        </h1>
        
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Page Not Found
        </h2>
        
        <p className="text-gray-400 text-lg">
          The page you are looking for doesn't exist or has been moved. 
          Maybe the coordinates were slightly off?
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-6 py-3 text-white transition-all hover:bg-white/10 hover:border-white/20"
          >
            <FiArrowLeft className="h-5 w-5" />
            Go Back
          </Link>
          
          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#DC2626] to-[#B91C1C] px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-[#B91C1C] hover:to-[#7F1D1D] hover:shadow-red-900/20"
          >
            <FiHome className="h-5 w-5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
