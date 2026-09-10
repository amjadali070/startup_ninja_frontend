import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => (
    <section className="relative w-full h-[100dvh] overflow-hidden bg-black flex flex-col items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
            <img 
                src="/images/hero-bg.png" 
                alt="Background" 
                className="w-full h-full object-cover opacity-90" 
            />
            {/* Subtle overlay for better text contrast if needed */}
            <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Text Layer - Behind the Ninja */}
        <div className="absolute top-[15%] md:top-[35%] z-10 w-full flex flex-col items-center text-center animate-fadeIn">
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight drop-shadow-2xl">
                Your Vision Is <br />
                AI's Creativity
            </h1>
        </div>

        {/* Ninja Image - Middle Layer */}
        {/* <div className="absolute bottom-20 inset-x-0 z-20 hidden md:flex justify-center items-end pointer-events-none h-full mr-10">
            <img 
                src="/images/hero-ninja.png" 
                alt="Ninja AI" 
                className="h-[30vh] md:h-[45vh] object-contain object-bottom animate-slideUp"
            />
        </div> */}

        {/* Buttons Layer - Top Layer (Interactive) */}
        <div className="absolute bottom-10 md:bottom-8 z-30 flex flex-col md:flex-row gap-3 md:gap-6 w-full justify-center px-4 animate-fadeIn delay-100">
            <Link 
                to="/login" 
                className="px-8 py-4 bg-[#d62424] hover:bg-[#b91c1c] text-white rounded-md font-bold text-lg transition-all transform hover:scale-105 shadow-lg text-center"
            >
                START FOR FREE
            </Link>
            <Link 
                to="/book-demo" 
                className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white/10 text-white rounded-md font-bold text-lg transition-all transform hover:scale-105 shadow-lg text-center"
            >
                BOOK A DEMO
            </Link>
        </div>
    </section>
);

export default HeroSection;
