import React from 'react';
import FooterSection from '../components/landing-page/FooterSection';
import Navbar from '../components/landing-page/Navbar';

const FrontLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
    <Navbar />
    {children}
    <FooterSection />
  </div>
);

export default FrontLayout;
