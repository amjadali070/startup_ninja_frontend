import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => (
    // <nav className="w-full fixed top-0 left-0 z-30 px-8 py-4 flex items-center justify-between">\
      <nav className="w-full px-8 py-4 flex items-center justify-between absolute top-0 left-0 z-20">

        <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
                <img src="/images/logo.png" alt="Startup Ninja" className="h-16 w-auto" />
            </Link>
            <div className="hidden md:flex gap-6 text-white text-sm font-medium">
                <span className="cursor-pointer">Products</span>
                <span className="cursor-pointer">Solutions</span>
                <span className="cursor-pointer">Developers</span>
                <span className="cursor-pointer">Resources</span>
                <span className="cursor-pointer">Pricing</span>
            </div>
        </div>
        <div className="flex items-center gap-4">
            {/* shadow-[0_8px_24px_0_rgba(220,38,38,0.2)] */}
            <Link to="/login" className="px-6 py-4 rounded-lg bg-[#393234] text-white font-semibold hover:bg-[#333]  transition">Sign In</Link>
            <Link to="/register" className="px-6 py-4 rounded-lg bg-[#d62424] text-white font-semibold hover:bg-[#c81c1c]  transition">Start For Free</Link>
        </div>
    </nav>
);

export default Navbar;
