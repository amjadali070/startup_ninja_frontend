import React from 'react';
import FooterSection from '../components/landing-page/FooterSection';

const FrontLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
    {children}
    <FooterSection />
  </div>
);

export default FrontLayout;
