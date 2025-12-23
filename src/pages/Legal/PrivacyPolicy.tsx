const PrivacyPolicy = () => {
  return (
    <div className="bg-[#0D0D0D] min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-plus-jakarta">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">Privacy Policy</h1>
            
            <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                <p className="lead text-xl text-gray-400 mb-8">
                    Last updated: December 22, 2025
                </p>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">1. Information We Collect</h3>
                <p>
                    We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.
                </p>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">2. How We Use Your Information</h3>
                <p>
                    We use the information we collect to provide, maintain, and improve our services, such as to:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Provide, maintain, and improve our Services, including developing new features and support.</li>
                    <li>Process your transactions and send you related information, including confirmations and invoices.</li>
                    <li>Send you technical notices, updates, security alerts, and support and administrative messages.</li>
                    <li>Respond to your comments, questions, and requests and provide customer service.</li>
                </ul>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">3. Log Data</h3>
                <p>
                    When you access the Service by or through a mobile device, we may collect certain information automatically, including, but not limited to, the type of mobile device you use, your mobile device unique ID, the IP address of your mobile device, your mobile operating system, the type of mobile Internet browser you use, unique device identifiers and other diagnostic data.
                </p>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">4. Security</h3>
                <p>
                    The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                </p>
                
                 <h3 className="text-white text-xl font-bold mt-8 mb-4">5. Third-Party Services</h3>
                <p>
                   We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.
                </p>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">6. Changes to This Privacy Policy</h3>
                <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                </p>
                
                <h3 className="text-white text-xl font-bold mt-8 mb-4">Contact Us</h3>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at privacy@startupninja.com.
                </p>
            </div>
        </div>
    </div>
  );
};

export default PrivacyPolicy;
