const FAQS = [
  {
    q: "What is Startup Ninja?",
    a: "An AI workspace for founders and small teams: AI chat, image generation, a website builder, social media scheduling, contract drafting, and a lightweight CRM, all in one product.",
  },
  {
    q: "What are AI credits / usage limits?",
    a: "Each plan includes a monthly allowance for AI-powered actions (chat messages, image generations, AI post writing, etc.). Usage resets each billing cycle and doesn't roll over, so pick a plan that matches your typical monthly usage.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. Our free tier gives you limited access to every tool so you can try the product before subscribing. Upgrade anytime for higher usage limits and additional features.",
  },
  {
    q: "Can I change my plan later?",
    a: "Yes. Upgrades take effect immediately (prorated for the rest of your current billing period). Downgrades take effect at the start of your next billing period, so you keep your current plan's access until then.",
  },
  {
    q: "What payment methods do you accept?",
    a: "All major credit and debit cards, processed securely through Stripe. We never see or store your full card number.",
  },
  {
    q: "Do you offer refunds?",
    a: "We don't offer refunds for partial billing periods, but if you're charged in error we'll make it right. See our Refund Policy for the specifics.",
  },
  {
    q: "Who owns the content I create with AI?",
    a: "You do. Text, images, websites, and documents you generate through Startup Ninja belong to you, with full commercial rights, subject to the underlying AI provider's own usage policies.",
  },
  {
    q: "Can I use Ninja Legal instead of a lawyer?",
    a: "No. Ninja Legal helps you draft and analyze contracts faster, but it's assistance, not legal advice. We recommend having a licensed attorney review anything legally binding.",
  },
  {
    q: "What happens to my data if I delete my account?",
    a: "Your content (images, documents, contracts, posts, websites, chats, and CRM data) is removed from every part of the product. Billing/transaction records are retained in anonymized form, as required for accounting purposes.",
  },
  {
    q: "Can I export my data?",
    a: "Yes. Download a copy of your account data (profile, business info, subscription, and billing history) anytime from Settings.",
  },
  {
    q: "Do you offer team accounts?",
    a: "Yes. Invite teammates from Team Management, with role-based permissions per module (Sales, Legal, etc.). Invited members set their own password via a real email invite.",
  },
];

const FAQ = () => {
  return (
    <div className="bg-[#0D0D0D] min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-plus-jakarta">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-400 mb-10">
                Answers to the questions we hear most. Can't find what you're looking for? <a href="/contact" className="text-red-400 hover:text-red-300">Contact us</a>.
            </p>

            <div className="space-y-4">
                {FAQS.map((item) => (
                    <div key={item.q} className="rounded-xl border border-white/10 bg-[#151515] p-6">
                        <h3 className="text-white text-lg font-bold mb-2">{item.q}</h3>
                        <p className="text-gray-300 leading-relaxed">{item.a}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default FAQ;
