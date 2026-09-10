import React from "react";
import { Link } from "react-router-dom";
import { FaDollarSign, FaClock, FaTools, FaRocket } from "react-icons/fa";

const SolutionsMain: React.FC = () => {
  const problems = [
    {
      icon: <FaDollarSign className="w-8 h-8" />,
      title: "Expensive",
      description:
        "Paying for a separate AI chat tool, image tool, website builder, and social scheduler adds up to $100-300/month",
    },
    {
      icon: <FaClock className="w-8 h-8" />,
      title: "Time-Consuming",
      description:
        "Constantly switching between platforms wastes hours every week",
    },
    {
      icon: <FaTools className="w-8 h-8" />,
      title: "Barrier to Entry",
      description:
        "Brilliant ideas die because founders lack technical or design skills",
    },
  ];

  const solutions = [
    {
      title: "Consolidated Workflow",
      description:
        "All tools in one place. No more copy-pasting between platforms.",
      benefit: "Save 20+ hours per week",
    },
    {
      title: "Strategic Co-Founder",
      description:
        "A partner that understands your entire business, not just a chatbot that answers questions.",
      benefit: "Make better decisions faster",
    },
    {
      title: "Unbeatable Value",
      description:
        "Replace $100-300/month in subscriptions with one affordable price.",
      benefit: "Save $1,000+ annually",
    },
    {
      title: "Zero Technical Barriers",
      description:
        "No coding, no design skills needed. Just your brilliant idea.",
      benefit: "Launch in days, not months",
    },
    {
      title: "Collaborative Sales Engine",
      description:
        "Run your pipeline with team-driven workflows, lead tracking, and proposals, all in one place.",
      benefit: "Close deals 2x faster",
    },
    {
      title: "Legal & Compliance Architect",
      description:
        "Navigate founder structuring, equity modeling, and generate bulletproof contracts effortlessly.",
      benefit: "Avoid costly legal mistakes",
    },
  ];

  const useCases = [
    {
      title: "Solopreneurs",
      description:
        "You're the CEO, marketer, designer, and developer all in one. We give you the power of a full team.",
      icon: "🥷",
    },
    {
      title: "Freelancers",
      description:
        "Scale your operations and manage multiple clients from one dashboard with ninja-like efficiency.",
      icon: "⚡",
    },
    {
      title: "Small Agencies",
      description:
        "Increase your output and profit margins by delivering faster with our all-in-one platform.",
      icon: "🚀",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-8 md:pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Stop Juggling{" "}
            <span style={{ color: "#D23621" }}>A Dozen Tools</span>
          </h1>
          <p
            className="text-xl md:text-2xl mb-3 max-w-3xl mx-auto"
            style={{ color: "#CCCCCC" }}
          >
            The fragmented startup stack is killing your momentum. We
            consolidate everything you need into one intelligent platform.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-8 px-4 bg-gradient-to-b from-black to-red-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The <span style={{ color: "#D23621" }}>Fragmented Stack</span>{" "}
              Problem
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: "#CCCCCC" }}
            >
              When you have a brilliant idea, you're immediately forced to
              become four experts at once: a strategist, designer, developer,
              and marketer.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {problems.map((problem, index) => (
              <div
                key={index}
                className="rounded-xl p-8 text-center bg-[#141010] border border-white/10 shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <div
                  className="inline-block p-4 rounded-full mb-4"
                  style={{
                    background:
                      "radial-gradient(50% 50% at 50% 50%, rgba(222, 5, 0, 0.7) 0%, rgba(120, 3, 0, 0) 100%)",
                  }}
                >
                  <div style={{ color: "#D23621" }}>{problem.icon}</div>
                </div>
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ color: "#D23621" }}
                >
                  {problem.title}
                </h3>
                <p style={{ color: "#CCCCCC" }}>{problem.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center rounded-2xl p-8 bg-[#141010] border border-white/10 shadow-lg">
            <p className="text-xl" style={{ color: "#CCCCCC" }}>
              The result?{" "}
              <span className="font-bold" style={{ color: "#D23621" }}>
                Brilliant ideas die
              </span>{" "}
              because founders waste time and money on a fragmented stack of
              disconnected tools.
            </p>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our <span style={{ color: "#D23621" }}>All-in-One</span> Solution
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: "#CCCCCC" }}
            >
              Startup Ninja eliminates the fragmented stack by consolidating all
              four critical roles into one intelligent, integrated platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className="group rounded-xl p-8 bg-[#141010] border border-white/10 shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <h3
                  className="text-2xl font-bold mb-4 transition-colors"
                  style={{ color: "#FFFFFF" }}
                >
                  {solution.title}
                </h3>
                <p className="mb-4" style={{ color: "#CCCCCC" }}>
                  {solution.description}
                </p>
                <div
                  className="inline-block px-4 py-2 border rounded-lg font-semibold"
                  style={{
                    background:
                      "linear-gradient(91.58deg, rgba(217, 235, 255, 0.1175) 0.3%, rgba(217, 235, 255, 0.047) 50.35%, rgba(130, 141, 153, 0.1128) 98.52%)",
                    borderColor: "#D23621",
                    color: "#D23621",
                  }}
                >
                  <FaRocket className="inline mr-2" />
                  {solution.benefit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4 bg-gradient-to-b from-black via-red-900/10 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built For <span style={{ color: "#D23621" }}>Every Founder</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="rounded-xl p-8 text-center bg-[#141010] border border-white/10 shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <div className="text-6xl mb-4">{useCase.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{useCase.title}</h3>
                <p style={{ color: "#CCCCCC" }}>{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl p-12 bg-[#141010] border border-white/10 shadow-lg">
            <h2 className="text-4xl font-bold mb-8 text-center">
              The Math is Simple
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="text-center">
                <p className="mb-2" style={{ color: "#CCCCCC" }}>
                  Typical Fragmented Stack
                </p>
                <p
                  className="text-5xl font-bold mb-2"
                  style={{ color: "#D23621" }}
                >
                  $100-300
                </p>
                <p style={{ color: "#CCCCCC" }}>per month</p>
                <ul
                  className="text-left text-sm mt-4 space-y-2"
                  style={{ color: "#CCCCCC" }}
                >
                  <li>• AI Chat Tool: $20/mo</li>
                  <li>• AI Image Tool: $30/mo</li>
                  <li>• Website Builder: $23/mo</li>
                  <li>• Social Scheduler: $12/mo</li>
                  <li>• + More tools...</li>
                </ul>
              </div>

              <div className="text-center">
                <p className="mb-2" style={{ color: "#CCCCCC" }}>
                  Startup Ninja
                </p>
                <p className="text-5xl font-bold mb-2 text-green-500">
                  One Price
                </p>
                <p style={{ color: "#CCCCCC" }}>all-inclusive</p>
                <div
                  className="mt-4 p-4 border rounded-lg"
                  style={{
                    background:
                      "linear-gradient(91.58deg, rgba(217, 235, 255, 0.1175) 0.3%, rgba(217, 235, 255, 0.047) 50.35%, rgba(130, 141, 153, 0.1128) 98.52%)",
                    borderColor: "#22c55e",
                  }}
                >
                  <p className="text-2xl font-bold text-green-400">
                    Save $1,000+
                  </p>
                  <p style={{ color: "#CCCCCC" }}>annually</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/pricing"
                className="inline-block px-8 py-4 rounded-lg font-bold text-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)",
                }}
              >
                SEE PRICING
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Consolidate Your Stack?
          </h2>
          <p className="text-xl mb-8" style={{ color: "#CCCCCC" }}>
            Replace complexity with clarity: one workspace instead of a stack of tools.
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-4 rounded-lg font-bold text-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300"
            style={{
              background: "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)",
            }}
          >
            GET STARTED
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SolutionsMain;
