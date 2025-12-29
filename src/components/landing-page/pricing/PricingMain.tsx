import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";

const PricingMain: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );

  const plans = [

    {
      name: "Startup",
      tagline: "For beginners just starting out",
      price: { monthly: 9, annual: 7 },
      features: [
        { text: "50 AI Chat messages/mo", included: true },
        { text: "20 Image Generations/mo", included: true },
        { text: "3 Website projects", included: true },
        { text: "Startup Ninja subdomain", included: true },
        { text: "Basic Social Media scheduling", included: true },
        { text: "Custom domain", included: false },
        { text: "Priority support", included: false },
        { text: "Team collaboration", included: false },
      ],
      cta: "GET STARTED",
      popular: false,
    },
    {
      name: "Pro",
      tagline: "For solopreneurs building their dream",
      price: { monthly: 29, annual: 24 },
      features: [
        { text: "500 AI Chat messages/mo", included: true },
        { text: "100 Image Generations/mo", included: true },
        { text: "10 Website projects", included: true },
        { text: "Custom domain support", included: true },
        { text: "Full Social Media Pro access", included: true },
        { text: "Priority email support", included: true },
        { text: "SEO optimization tools", included: true },
        { text: "Team collaboration", included: false },
      ],
      cta: "GET STARTED",
      popular: true,
    },
    {
      name: "Enterprise",
      tagline: "For agencies and growing teams",
      price: { monthly: 99, annual: 82 },
      features: [
        { text: "Unlimited AI Chat", included: true },
        { text: "1000 AI credits/month", included: true },
        { text: "50 Website projects", included: true },
        { text: "White-label options", included: true },
        { text: "Team management", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Priority phone support", included: true },
        { text: "Dedicated account manager", included: true },
      ],
      cta: "CONTACT SALES",
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "What are AI credits?",
      answer:
        "AI credits are used whenever you generate content, images, or research with your AI tools. Different tasks use different amounts of credits based on complexity.",
    },
    {
      question: "Can I change my plan later?",
      answer:
        "Yes! You can upgrade or downgrade your plan at any time from your Account Settings. Changes take effect immediately.",
    },
    {
      question: "Do unused credits roll over?",
      answer:
        "No, credits reset each billing cycle. We recommend choosing a plan that matches your monthly usage.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Yes! Our Starter plan is completely free with limited access to all tools. Upgrade anytime to unlock full features.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit and debit cards. Annual plans receive a 17% discount.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Plans Built for{" "}
            <span style={{ color: "#D23621" }}>Every Stage</span>
          </h1>
          <p
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            style={{ color: "#CCCCCC" }}
          >
            Start free, scale as you grow. No hidden fees, cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center rounded-lg p-1 mb-12 bg-[#151515]">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                billingCycle === "monthly" ? "" : "hover:text-white"
              }`}
              style={
                billingCycle === "monthly"
                  ? {
                      background:
                        "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)",
                    }
                  : { color: "#CCCCCC" }
              }
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                billingCycle === "annual" ? "" : "hover:text-white"
              }`}
              style={
                billingCycle === "annual"
                  ? {
                      background:
                        "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)",
                    }
                  : { color: "#CCCCCC" }
              }
            >
              Annual
              <span className="ml-2 text-xs bg-green-600 px-2 py-1 rounded">
                Save 17%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-lg p-8 border transition-all duration-300 ${
                  plan.popular ? "scale-105" : ""
                }`}
                style={{
                  background:
                    "linear-gradient(135.17deg, rgba(55, 65, 81, 0.5) -94.55%, rgba(18, 16, 16, 0.5) 95.54%)",
                  border: plan.popular
                    ? "1px solid #D23621"
                    : "1px solid #8B0000",
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span
                      className="px-4 py-1 rounded-full text-sm font-bold"
                      style={{
                        background:
                          "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)",
                      }}
                    >
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <h3 className="text-3xl font-bold mb-2">{plan.name}</h3>
                <p className="mb-6" style={{ color: "#CCCCCC" }}>
                  {plan.tagline}
                </p>

                <div className="mb-8">
                  <span className="text-5xl font-bold">
                    $
                    {billingCycle === "monthly"
                      ? plan.price.monthly
                      : plan.price.annual}
                  </span>
                  <span className="ml-2" style={{ color: "#CCCCCC" }}>
                    /month
                  </span>
                  {billingCycle === "annual" && plan.price.annual > 0 && (
                    <p className="text-sm text-green-500 mt-2">
                      Billed ${plan.price.annual * 12}/year
                    </p>
                  )}
                </div>

                <Link
                  to={plan.price.monthly === 0 ? "/register" : "/register"}
                  className={`block w-full py-4 rounded-lg font-bold text-center mb-8 transition-all duration-300 ${
                    plan.popular
                      ? "hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]"
                      : "hover:opacity-80"
                  }`}
                  style={
                    plan.popular
                      ? {
                          background:
                            "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)",
                        }
                      : {
                          background:
                            "linear-gradient(91.58deg, rgba(217, 235, 255, 0.1175) 0.3%, rgba(217, 235, 255, 0.047) 50.35%, rgba(130, 141, 153, 0.1128) 98.52%)",
                        }
                  }
                >
                  {plan.cta}
                </Link>

                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      {feature.included ? (
                        <FaCheck
                          className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"
                          style={{ color: "#D23621" }}
                        />
                      ) : (
                        <FaTimes
                          className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"
                          style={{ color: "#666" }}
                        />
                      )}
                      <span
                        style={{ color: feature.included ? "#CCCCCC" : "#666" }}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-16 bg-[#151515] border border-[#333] rounded-lg p-6 max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">Not ready to commit?</h3>
                <p className="text-[#CCCCCC]">Get started with our <span className="text-white font-semibold">Free Plan</span>. Includes 15 AI Messages, 5 Images, and 1 Website.</p>
             </div>
             <Link
                to="/register"
                className="px-6 py-3 rounded-lg border border-[#333] hover:bg-[#222] transition-colors font-semibold whitespace-nowrap"
             >
                Start for Free
             </Link>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-red-900/10 to-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The Math is <span style={{ color: "#D23621" }}>Simple</span>
          </h2>
          <p className="text-xl mb-12" style={{ color: "#CCCCCC" }}>
            Replace $100-300/month in subscriptions with one affordable price
          </p>

          <div
            className="rounded-lg p-8 border"
            style={{
              background:
                "linear-gradient(135.17deg, rgba(55, 65, 81, 0.5) -94.55%, rgba(18, 16, 16, 0.5) 95.54%)",
              border: "1px solid #333",
            }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#D23621" }}
                >
                  Typical Stack
                </h3>
                <ul className="space-y-3 text-left">
                  <li className="flex justify-between">
                    <span>ChatGPT Plus</span>
                    <span>$20/mo</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Midjourney</span>
                    <span>$30/mo</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Webflow</span>
                    <span>$23/mo</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Buffer</span>
                    <span>$12/mo</span>
                  </li>
                  <li
                    className="flex justify-between border-t pt-3 font-bold"
                    style={{ borderColor: "#666", color: "#D23621" }}
                  >
                    <span>Total</span>
                    <span>$85+/mo</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4 text-green-500">
                  Startup Ninja
                </h3>
                <ul className="space-y-3 text-left">
                  <li className="flex justify-between">
                    <span>AI Chat (Unlimited)</span>
                    <span className="text-green-500">✓</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Image Generation</span>
                    <span className="text-green-500">✓</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Web Builder + Hosting</span>
                    <span className="text-green-500">✓</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Social Media Pro</span>
                    <span className="text-green-500">✓</span>
                  </li>
                  <li
                    className="flex justify-between border-t pt-3 font-bold text-green-500"
                    style={{ borderColor: "#666" }}
                  >
                    <span>Total</span>
                    <span>$29/mo</span>
                  </li>
                </ul>
              </div>
            </div>

            <div
              className="mt-8 p-6 border rounded-lg"
              style={{
                background:
                  "linear-gradient(91.58deg, rgba(217, 235, 255, 0.1175) 0.3%, rgba(217, 235, 255, 0.047) 50.35%, rgba(130, 141, 153, 0.1128) 98.52%)",
                borderColor: "#22c55e",
              }}
            >
              <p className="text-2xl font-bold text-green-400">
                Save $672+ per year
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            Frequently Asked <span style={{ color: "#D23621" }}>Questions</span>
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-lg p-6 border transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(135.17deg, rgba(55, 65, 81, 0.5) -94.55%, rgba(18, 16, 16, 0.5) 95.54%)",
                  border: "1px solid #8B0000",
                }}
              >
                <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                <p style={{ color: "#CCCCCC" }}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div
          className="max-w-4xl mx-auto text-center rounded-lg p-12"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(222, 5, 0, 0.7) 0%, rgba(120, 3, 0, 0) 100%)",
            boxShadow:
              "near-gradient(143.82deg, rgba(129, 0, 0, 0.5) -18.07%, rgba(58, 0, 0, 0.5) 4.29%, rgba(29, 0, 0, 0.25) 56.47%, rgba(13, 12, 13, 0.5) 101.2%);",
          }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Save Time and Money?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start free today. No credit card required.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-900 transition-all duration-300"
            style={{
              background:
                "linear-gradient(91.58deg, rgba(217, 235, 255, 0.1175) 0.3%, rgba(217, 235, 255, 0.047) 50.35%, rgba(130, 141, 153, 0.1128) 98.52%)",
              backdropFilter: "blur(32px)",
              border: "1px solid #FF8C8C",
              boxShadow:
                "0px 0px 16px 0px #FF8C8C26 inset, 0px 12px 36px 0px #E58C8C2B",
            }}
          >
            START FOR FREE
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PricingMain;
