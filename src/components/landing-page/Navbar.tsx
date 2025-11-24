import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="w-full px-4 md:px-8 py-4 flex items-center justify-between absolute top-0 left-0 z-50">
            <div className="flex items-center gap-8">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/images/logo.png" alt="Startup Ninja" className="h-12 md:h-16 w-auto" />
                </Link>
                <div className="hidden md:flex gap-6 text-white text-sm font-medium">
                    <span className="cursor-pointer hover:text-red-500 transition">Products</span>
                    <span className="cursor-pointer hover:text-red-500 transition">Solutions</span>
                    <span className="cursor-pointer hover:text-red-500 transition">Developers</span>
                    <span className="cursor-pointer hover:text-red-500 transition">Resources</span>
                    <span className="cursor-pointer hover:text-red-500 transition">Pricing</span>
                </div>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-4">
                <Link to="/login" className="px-6 py-4 rounded-lg bg-[#393234] text-white font-semibold hover:bg-[#333] transition">Sign In</Link>
                <Link to="/register" className="px-6 py-4 rounded-lg bg-[#d62424] text-white font-semibold hover:bg-[#c81c1c] transition">Start For Free</Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl focus:outline-none">
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-lg flex flex-col items-center py-8 gap-6 text-white text-lg font-medium shadow-2xl border-b border-white/10 md:hidden">
                    <span className="cursor-pointer hover:text-red-500 transition">Products</span>
                    <span className="cursor-pointer hover:text-red-500 transition">Solutions</span>
                    <span className="cursor-pointer hover:text-red-500 transition">Developers</span>
                    <span className="cursor-pointer hover:text-red-500 transition">Resources</span>
                    <span className="cursor-pointer hover:text-red-500 transition">Pricing</span>
                    <div className="flex flex-col gap-4 mt-4 w-full px-8">
                        <Link to="/login" className="px-6 py-3 rounded-lg bg-[#393234] text-white font-semibold text-center hover:bg-[#333] transition">Sign In</Link>
                        <Link to="/register" className="px-6 py-3 rounded-lg bg-[#d62424] text-white font-semibold text-center hover:bg-[#c81c1c] transition">Start For Free</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
