import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCheck, FaMinus } from "react-icons/fa";
import { planService, Plan } from "../../../services/plan";
import { getFeatureRowsForPlan } from "../../../utils/planFeatureRows";

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
        "Yes! Our Starter plan is completely free with limited access to all tools. Upgrade anytime for full access to every feature.",
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
      <section className="relative pt-24 md:pt-32 pb-8 md:pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-7xl font-bold mb-4 md:mb-6">
            Plans Built for{" "}
            <span style={{ color: "#D23621" }}>Every Stage</span>
          </h1>
          <p
            className="text-lg md:text-2xl mb-6 md:mb-8 max-w-3xl mx-auto"
            style={{ color: "#CCCCCC" }}
          >
            Start free, scale as you grow. No hidden fees, cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center rounded-lg p-1 mb-4 md:mb-12 bg-[#151515]">
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
      <section className="py-4 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
             <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
             </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6 max-w-7xl mx-auto">
            {paidPlans.map((plan, index) => {
               // Calculate price based on cycle
               // Monthly cycle: use plan.price
               // Annual cycle: use plan.discountPrice (assumed to be monthly cost when annual)
               const isEnterprise = plan.key === 'custom' || plan.name.toLowerCase() === 'custom';
               const displayPrice = billingCycle === "monthly" ? plan.price : (plan.discountPrice || plan.price);
               const isPopular = plan.isPopular;

               return (
              <div
                key={plan._id || index}
                className={`relative rounded-2xl p-6 border bg-[#1a0f0f] hover:-translate-y-1 transition-transform duration-300 flex flex-col ${
                  isPopular ? "border-2 xl:scale-105 xl:-translate-y-2 shadow-2xl" : "border-red-900/30 shadow-lg"
                }`}
                style={
                  isPopular
                    ? {
                        background:
                          "linear-gradient(28deg, #f5222d17 7.34%, rgb(222 5 0 / 30%) 81.6%), linear-gradient(17.32deg, rgba(0, 0, 0, 0.8) 55.8%, rgb(222 5 0 / 33%) 141.07%)",
                        borderColor: "rgba(222, 5, 0, 0.6)",
                      }
                    : {}
                }
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold tracking-wide whitespace-nowrap"
                      style={{
                        background:
                          "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)",
                      }}
                    >
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                <p className="text-sm mb-4 h-10 flex-none" style={{ color: "#CCCCCC" }}>
                  {plan.description || "Explore what's included."}
                </p>

                {isEnterprise ? (
                  <div className="mb-5 flex-none">
                    <span className="text-3xl font-bold">Custom</span>
                    <span className="ml-2 text-sm" style={{ color: "#CCCCCC" }}>
                        Pricing
                    </span>
                    {billingCycle === "annual" && (
                      <p className="text-sm mt-2 opacity-0">Spacer</p>
                    )}
                  </div>
                ) : (
                  <div className="mb-5 flex-none">
                    <span className="text-3xl font-bold">
                      ${displayPrice}
                    </span>
                    <span className="ml-1 text-sm" style={{ color: "#CCCCCC" }}>
                      /month
                    </span>
                    {billingCycle === "annual" && (
                      <p className="text-xs text-green-500 mt-2">
                        Billed ${(displayPrice * 12).toFixed(2)}/year
                      </p>
                    )}
                  </div>
                )}

                {isEnterprise ? (
                    <Link
                        to="/contact?plan=custom"
                        className="block w-full text-center bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-md font-semibold mb-5 flex-none shadow-md hover:shadow-red-600/40 transition text-sm"
                    >
                        Contact for pricing
                    </Link>
                ) : (
                    <Link
                      to={displayPrice === 0 ? "/register" : `/buy-subscription?plan=${plan.name}&billing=${billingCycle}`}
                      className="block w-full text-center bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-md font-semibold mb-5 flex-none shadow-md hover:shadow-red-600/40 transition-all duration-300 text-sm"
                    >
                      {displayPrice === 0 ? "START FOR FREE" : "GET STARTED"}
                    </Link>
                )}

                <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#888" }}>
                  What's included
                </p>
                <ul className="space-y-2.5">
                  {getFeatureRowsForPlan(plan, isEnterprise).map((row, idx) => (
                    <li key={idx} className="flex items-start">
                      {row.included ? (
                        <FaCheck
                          className="w-3.5 h-3.5 mr-2 flex-shrink-0 mt-0.5"
                          style={{ color: "#D23621" }}
                        />
                      ) : (
                        <FaMinus className="w-3 h-3 mr-2 flex-shrink-0 mt-1" style={{ color: "#555" }} />
                      )}
                      <span className="text-sm leading-snug" style={{ color: row.included ? "#CCCCCC" : "#555" }}>
                        <span className="font-medium">{row.product}</span>
                        {row.included && <span style={{ color: "#999" }}>: {row.detail}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
            })}
          </div>
          )}
          
          <div className="mt-16 bg-[#141010] border border-white/10 shadow-lg rounded-2xl p-6 max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
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

          <div className="rounded-2xl p-8 bg-[#141010] border border-white/10 shadow-lg">
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
                    <span>AI Chat Tool</span>
                    <span>$20/mo</span>
                  </li>
                  <li className="flex justify-between">
                    <span>AI Image Tool</span>
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
                    <span>AI Chat</span>
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
                    <span>$39/mo</span>
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
                Save $1,512+ per year
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
                className="rounded-xl p-6 bg-[#141010] border border-white/10 shadow-lg hover:scale-105 transition-transform duration-300"
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
            className="inline-block px-8 py-4 rounded-lg font-bold text-lg bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-[0_0_15px_rgba(214,36,36,0.6)] transition-all duration-300"
          >
            START FOR FREE
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PricingMain;

