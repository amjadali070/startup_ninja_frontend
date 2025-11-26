import React from 'react';

const TermsMain: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-4 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
          Terms & Conditions
        </h1>
        
        <div className="space-y-12 text-white/80">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="leading-relaxed">
              Welcome to Startup Ninja. By accessing our website and using our services, you agree to be bound by these Terms and Conditions. Please read them carefully.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Use of Services</h2>
            <p className="leading-relaxed mb-4">
              You agree to use our services only for lawful purposes and in accordance with these Terms. You are prohibited from violating or attempting to violate the security of the Service.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be at least 18 years old to use this service.</li>
              <li>You are responsible for maintaining the confidentiality of your account.</li>
              <li>You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Intellectual Property</h2>
            <p className="leading-relaxed">
              The Service and its original content, features, and functionality are and will remain the exclusive property of Startup Ninja and its licensors.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Termination</h2>
            <p className="leading-relaxed">
              We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Changes to Terms</h2>
            <p className="leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>
          
          <div className="pt-8 border-t border-white/10 text-sm text-white/50">
            Last updated: November 26, 2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsMain;
