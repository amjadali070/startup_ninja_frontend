import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { planService, Plan } from "../../../services/plan";

const PricingMain: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [plansData, setPlansData] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
        try {
            const response = await planService.getAllPlans();
            if (response.success && response.data) {
                setPlansData(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch plans", error);
        } finally {
            setLoading(false);
        }
    };
    fetchPlans();
  }, []);

  // Filter plans
  const paidPlans = plansData.filter(p => p.price > 0 && p.key !== 'free' && p.name.toLowerCase() !== 'free');
  const freePlan = plansData.find(p => p.price === 0 || p.key === 'free' || p.name.toLowerCase() === 'free');

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
        "We accept all major credit and debit cards. Annual plans receive a discount.",
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
                Save ~20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
             <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
             </div>
          ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {paidPlans.map((plan, index) => {
               // Calculate price based on cycle
               // Monthly cycle: use plan.price
               // Annual cycle: use plan.discountPrice (assumed to be monthly cost when annual)
               const displayPrice = billingCycle === "monthly" ? plan.price : (plan.discountPrice || plan.price);
               const isPopular = plan.isPopular;

               return (
              <div
                key={plan._id || index}
                className={`relative rounded-lg p-8 border transition-all duration-300 ${
                  isPopular ? "scale-105" : ""
                }`}
                style={{
                  background:
                    "linear-gradient(135.17deg, rgba(55, 65, 81, 0.5) -94.55%, rgba(18, 16, 16, 0.5) 95.54%)",
                  border: isPopular
                    ? "1px solid #D23621"
                    : "1px solid #8B0000",
                }}
              >
                {isPopular && (
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
                  {plan.description || "Unlock powerful features."}
                </p>

                <div className="mb-8">
                  <span className="text-5xl font-bold">
                    ${displayPrice}
                  </span>
                  <span className="ml-2" style={{ color: "#CCCCCC" }}>
                    /month
                  </span>
                  {billingCycle === "annual" && (
                    <p className="text-sm text-green-500 mt-2">
                      Billed ${(displayPrice * 12).toFixed(2)}/year
                    </p>
                  )}
                </div>

                <Link
                  to={displayPrice === 0 ? "/register" : `/buy-subscription?plan=${plan.name}&billing=${billingCycle}`}
                  className={`block w-full py-4 rounded-lg font-bold text-center mb-8 transition-all duration-300 ${
                    isPopular
                      ? "hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]"
                      : "hover:opacity-80"
                  }`}
                  style={
                    isPopular
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
                  {displayPrice === 0 ? "START FOR FREE" : "GET STARTED"}
                </Link>

                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                        <FaCheck
                          className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"
                          style={{ color: "#D23621" }}
                        />
                      <span style={{ color: "#CCCCCC" }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
            })}
          </div>
          )}
          
          <div className="mt-16 bg-[#151515] border border-[#333] rounded-lg p-6 max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">Not ready to commit?</h3>
                <p className="text-[#CCCCCC]">Get started with our <span className="text-white font-semibold">{freePlan ? freePlan.name : "Free"} Plan</span>.</p>
                {freePlan && (
                    <p className="text-xs text-gray-500 mt-1">Includes {freePlan.limits?.ai_chat_messages || 15} AI msg, {freePlan.limits?.generated_images || 5} Images, {freePlan.limits?.social_posts || 10} Social Posts.</p>
                )}
             </div>
             <Link
                to="/login"
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
            Replace $165+/month in subscriptions with one affordable price
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
                  <li className="flex justify-between">
                    <span>Sales CRM</span>
                    <span>$45/mo</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Legal Services</span>
                    <span>$35/mo</span>
                  </li>
                  <li
                    className="flex justify-between border-t pt-3 font-bold"
                    style={{ borderColor: "#666", color: "#D23621" }}
                  >
                    <span>Total</span>
                    <span>$165+/mo</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4 text-green-500">
                  Startup Ninja
                </h3>
                <ul className="space-y-3 text-left">
                  <li className="flex justify-between">
                    <span>AI Chat (Unlimited*)</span>
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
                  <li className="flex justify-between">
                    <span>Ninja Sales</span>
                    <span className="text-green-500">✓</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Ninja Legal</span>
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
                Save $1,632+ per year
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
              "radial-gradient(50% 50% at 50% 50%, rgba(222, 5, 0, 0.7) 0%, rgba(120, 3, 0, 0) 100%), linear-gradient(143.82deg, rgba(129, 0, 0, 0.5) -18.07%, rgba(58, 0, 0, 0.5) 4.29%, rgba(29, 0, 0, 0.25) 56.47%, rgba(13, 12, 13, 0.5) 101.2%)",
          }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Save Time and Money?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start free today. No credit card required.
          </p>
          <Link
            to="/login"
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

