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
                    We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide. If you sign in with Google or Microsoft, we receive your name, email address, and profile picture from that provider. We never see or store your Google/Microsoft password. If you subscribe to a paid plan, payment card details are collected and processed directly by our payment processor, Stripe. We do not store your full card number ourselves.
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

                <h3 className="text-white text-xl font-bold mt-8 mb-4">6. AI Processing of Your Content</h3>
                <p>
                    Startup Ninja's AI features, including Ninja Chat, Image Generation, Website Builder's AI editing, Social Pro's post generation, and Ninja Legal's document drafting/analysis, work by sending the prompts, documents, and images you submit to third-party AI providers (currently OpenAI and Google) so they can generate a response. We do not permit these providers to use your content to train their models. This processing is necessary for the AI features to function; if you'd prefer your content not be sent to a third-party AI provider, don't use those specific features. The rest of the product (Ninja Sales CRM, account/billing management, etc.) doesn't involve this.
                </p>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">7. Your Data, Export, and Deletion</h3>
                <p>
                    You can download a copy of the account data we hold about you (profile, business info, subscription, and billing history) at any time from Settings. Deleting your account removes your content (generated images, documents, contracts, posts, websites, chats, and CRM data) from every part of the product, and anonymizes what remains for accounting/audit purposes (we're required to retain transaction records, not tied back to your identifying details, for tax and financial recordkeeping).
                </p>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">8. Changes to This Privacy Policy</h3>
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
