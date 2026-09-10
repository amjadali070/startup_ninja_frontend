const TermsOfService = () => {
  return (
    <div className="bg-[#0D0D0D] min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-plus-jakarta">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">Terms of Service</h1>

            <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                <p className="lead text-xl text-gray-400 mb-8">
                    Last updated: September 10, 2026
                </p>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">1. Agreement to Terms</h3>
                <p>
                    By accessing or using Startup Ninja's services, including AI Chat, Image Generation, Web Builder, Social Pro, Ninja Legal, and Ninja Sales, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the service.
                </p>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">2. Use License</h3>
                <p>
                    Permission is granted to use Startup Ninja for personal or commercial purposes, subject to your plan's usage limits, including access to and use of AI Chat, Image Generation, Web Builder, Social Pro, and any other module included in your plan, and the creation and publication of content generated through the platform.
                </p>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">3. Subscription and Payment</h3>
                <p>
                    Startup Ninja offers multiple subscription tiers. By subscribing, you agree to pay all fees associated with your chosen plan, and that your subscription renews automatically at the end of each billing period unless cancelled beforehand. Our refund practices are described in the <a href="/refund-policy" className="text-red-400 hover:text-red-300">Refund Policy</a>.
                </p>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">4. Cancellation</h3>
                <p>
                    You may cancel your subscription at any time from Settings. Cancellation takes effect at the end of your current billing period: you keep access until then, and your account and data remain intact (not deleted) afterward, just downgraded to the free tier's limits.
                </p>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">5. AI-Generated Content and Intellectual Property</h3>
                <p>
                    The Service itself, including its software, design, and branding, is and remains the exclusive property of Startup Ninja. Content you create USING Startup Ninja (text, images, websites, contracts, and other generated output) belongs to you: you retain full ownership and commercial rights to it, subject to the underlying AI provider's own usage policies. Because this content is AI-generated, we make no guarantee of originality, accuracy, or fitness for any particular legal, financial, or professional purpose. In particular, contracts and compliance material generated through Ninja Legal are provided for informational assistance only and are not a substitute for advice from a licensed attorney.
                </p>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">6. User Accounts</h3>
                <p>
                    When you create an account, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in suspension or termination of your account.
                </p>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">7. Termination</h3>
                <p>
                    We may suspend or terminate your account for a violation of these Terms. You may delete your own account at any time from Settings. See our <a href="/privacy" className="text-red-400 hover:text-red-300">Privacy Policy</a> for what happens to your data when you do.
                </p>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">8. Limitation of Liability</h3>
                <p>
                    To the fullest extent permitted by law, Startup Ninja, its directors, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of, or inability to use, the Service.
                </p>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">9. Changes</h3>
                <p>
                    We may modify these Terms at any time. For material changes, we'll try to give at least 30 days' notice before the new terms take effect.
                </p>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">Contact Us</h3>
                <p>
                    Questions about these Terms? Reach us via our <a href="/contact" className="text-red-400 hover:text-red-300">Contact page</a> or at support@startupninja.com.
                </p>
            </div>
        </div>
    </div>
  );
};

export default TermsOfService;
