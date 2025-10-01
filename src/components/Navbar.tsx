import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-primary-black border-b border-secondary-grey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-primary-red font-bold text-xl">
                STARTUP
              </div>
              <div className="text-primary-red font-bold text-xl flex items-center">
                NINJA
                <span className="ml-1 text-text-white text-lg">🥷</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-text-white hover:text-primary-red transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-primary-red text-text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
