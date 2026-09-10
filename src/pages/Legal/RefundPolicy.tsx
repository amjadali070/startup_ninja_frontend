const RefundPolicy = () => {
  return (
    <div className="bg-[#0D0D0D] min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-plus-jakarta">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">Refund Policy</h1>

            <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                <p className="lead text-xl text-gray-400 mb-8">
                    Last updated: September 10, 2026
                </p>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">Subscriptions</h3>
                <p>
                    Startup Ninja subscriptions bill in advance for each billing period (monthly or annual, depending on your plan) and renew automatically until cancelled. We don't offer refunds or credits for partial billing periods. When you cancel, you keep full access to your plan until the end of the period you already paid for, and you won't be charged again afterward.
                </p>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">Cancelling Before Renewal</h3>
                <p>
                    If you cancel before your next billing date, you will not be charged for the upcoming period. Cancellation takes effect at the end of your current period: there's no immediate loss of access, and no partial-period refund is issued for the time remaining.
                </p>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">Billing Errors</h3>
                <p>
                    If you believe you were charged in error, such as a duplicate charge, a charge after you cancelled, or an incorrect amount, contact us and we'll investigate and issue a real refund for the erroneous charge once confirmed. This is the one case where a refund is genuinely issued, and it's handled case-by-case by our team, not automatically.
                </p>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">Plan Changes</h3>
                <p>
                    Upgrading your plan takes effect immediately, with the new plan's price prorated for the rest of your current billing period. Downgrading takes effect at the start of your next billing period: you keep your current (higher) plan's access until then, and there's no partial refund for downgrading mid-period.
                </p>

                <h3 className="text-white text-xl font-bold mt-8 mb-4">How to Request a Refund</h3>
                <p>
                    Reach out via our <a href="/contact" className="text-red-400 hover:text-red-300">Contact page</a> or email support@startupninja.com with your account email and a description of the issue. We aim to respond within 2 business days.
                </p>
            </div>
        </div>
    </div>
  );
};

export default RefundPolicy;
