import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname === path;
    };

    const getLinkClass = (path: string) => {
        const baseClass = "cursor-pointer transition relative px-1 py-1";
        // Ninja style: Red text, glow, and a "slash" underline effect
        const activeClass = "text-[#FF3B3B] font-bold drop-shadow-[0_0_8px_rgba(255,59,59,0.5)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#FF3B3B] after:shadow-[0_0_8px_rgba(255,59,59,0.8)] after:transform after:skew-x-12";
        const inactiveClass = "text-white hover:text-[#FF3B3B] hover:drop-shadow-[0_0_5px_rgba(255,59,59,0.5)]";

        return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'Solutions', path: '/solutions' },
        { name: 'Developers', path: '/developers' },
        { name: 'Resources', path: '/resources' },
        { name: 'Pricing', path: '/pricing' },
    ];

    return (
        <nav className="w-full px-4 md:px-8 py-4 flex items-center justify-between absolute top-0 left-0 z-50">
            <div className="flex items-center gap-8">
                <Link to="/" className="flex items-center gap-2 group">
                    <img 
                        src="/images/logo.png" 
                        alt="Startup Ninja" 
                        className="h-12 md:h-16 w-auto transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]" 
                    />
                </Link>
                <div className="hidden md:flex gap-6 text-sm font-medium">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name}
                            to={link.path} 
                            className={getLinkClass(link.path)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-4">
                <Link to="/login" className="px-6 py-3 rounded-lg bg-[#393234] text-white font-semibold hover:bg-[#2a2526] hover:shadow-[0_0_15px_rgba(57,50,52,0.5)] transition-all duration-300 border border-transparent hover:border-gray-600">
                    Sign In
                </Link>
                <Link to="/register" className="px-6 py-3 rounded-lg bg-[#d62424] text-white font-semibold hover:bg-[#b01b1b] hover:shadow-[0_0_15px_rgba(214,36,36,0.6)] transition-all duration-300 border border-transparent hover:border-red-500">
                    Start For Free
                </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl focus:outline-none hover:text-[#FF3B3B] transition-colors">
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl flex flex-col items-center py-8 gap-6 text-white text-lg font-medium shadow-2xl border-b border-white/10 md:hidden animate-in slide-in-from-top-5 duration-300">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name}
                            to={link.path} 
                            className={getLinkClass(link.path)}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex flex-col gap-4 mt-4 w-full px-8">
                        <Link to="/login" className="px-6 py-3 rounded-lg bg-[#393234] text-white font-semibold text-center hover:bg-[#2a2526] transition-colors">Sign In</Link>
                        <Link to="/register" className="px-6 py-3 rounded-lg bg-[#d62424] text-white font-semibold text-center hover:bg-[#b01b1b] transition-colors">Start For Free</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
