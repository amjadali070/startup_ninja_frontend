import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => (
    <section className="absolute inset-0 w-full h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden z-10">
        <img src="/images/hero-banner.png" alt="Hero Banner"
            className="absolute inset-0 w-full h-full object-cover object-top z-0 opacity-70 animate-zoomIn" />

        <div className="relative z-10 flex flex-col items-center justify-center pt-24 pb-16 px-4 hero-info animate-slideUp">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 leading-tight drop-shadow-lg">
                Your Vision Is <br /> AI's Creativity
            </h1>
            <p className="text-lg md:text-xl text-center max-w-2xl mb-8 text-white/80">
                Speak your words, and let our AI bring them to life in stunning images. From concept to realization.
            </p>
            <div className="flex gap-4 mt-4">
                <Link to="/register" className="px-6 py-4 rounded-lg bg-[#d62424] text-white font-semibold hover:bg-[#c81c1c] transition">
                    START FOR FREE
                </Link>
                <Link to="#demo" className="px-6 py-4 rounded-lg border border-white text-white font-semibold hover:bg-white/10 transition">
                    BOOK A DEMO
                </Link>
            </div>
        </div>
    </section>
);

export default HeroSection;
