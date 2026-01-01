import React from "react";
import { Link } from "react-router-dom";
import { FaRocket, FaImage, FaCode, FaShareAlt, FaCheck } from "react-icons/fa";

const ProductsMain: React.FC = () => {
  const products = [
    {
      icon: <FaRocket className="w-12 h-12" />,
      name: "Ninja Chat",
      tagline: "Your 24/7 Strategic Partner",
      description:
        "Your AI Co-Founder that conducts deep research, creates content, and helps you build winning strategies. From market analysis to blog posts, it handles everything.",
      features: [
        "Deep General Research",
        "Business Strategy & Analysis",
        "Content Creation",
        "Planning & Operations",
      ],
      color: "from-red-600 to-orange-600",
    },
    {
      icon: <FaImage className="w-12 h-12" />,
      name: "Imaginative Ninja",
      tagline: "Your In-House Creative Director",
      description:
        "Turn text into stunning visuals in seconds. Generate logos, brand assets, and marketing materials without expensive designers or stock photos.",
      features: [
        "Complete Brand Identity",
        "Marketing & Ad Creative",
        "Unlimited Revisions",
        "Content Library",
      ],
      color: "from-orange-600 to-red-600",
    },
    {
      icon: <FaCode className="w-12 h-12" />,
      name: "Web Builder",
      tagline: "Your Expert No-Code Developer",
      description:
        "Launch your professional website in minutes with our drag-and-drop builder. No coding required, SEO-optimized from day one.",
      features: [
        "Drag-and-Drop Editor",
        "SEO-Optimized",
        "Free Hosting & SSL",
        "Integrated Blog",
      ],
      color: "from-red-600 to-pink-600",
    },
    {
      icon: <FaShareAlt className="w-12 h-12" />,
      name: "Social Media Pro",
      tagline: "Your Tireless Marketing Manager",
      description:
        "Automate your social media presence. Plan, create, and schedule content for all platforms from one unified dashboard.",
      features: [
        "Unified Content Calendar",
        "AI-Powered Content",
        "Automated Scheduling",
        "Multi-Platform Support",
      ],
      color: "from-pink-600 to-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Your Complete{" "}
            <span style={{ color: "#D23621" }}>AI Co-Founder Toolkit</span>
          </h1>

          <p
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            style={{ color: "#CCCCCC" }}
          >
            Four powerful tools, one integrated platform. Everything you need to
            build, design, and market your startup—faster than ever.
          </p>
          <Link
            to="/pricing"
            className="inline-block px-8 py-4 rounded-lg font-bold text-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300"
            style={{
              background: "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)",
            }}
          >
            GET STARTED
          </Link>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product, index) => (
              <div
                key={index}
                className="group relative rounded-lg p-8 transition-all duration-300 border"
                style={{
                  background:
                    "linear-gradient(135.17deg, rgba(55, 65, 81, 0.5) -94.55%, rgba(18, 16, 16, 0.5) 95.54%)",
                  border: "1px solid #8B0000",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(143.82deg, rgba(129, 0, 0, 0.5) -18.07%, rgba(58, 0, 0, 0.5) 4.29%, rgba(29, 0, 0, 0.25) 56.47%, rgba(13, 12, 13, 0.5) 101.2%)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135.17deg, rgba(55, 65, 81, 0.5) -94.55%, rgba(18, 16, 16, 0.5) 95.54%)";
                }}
              >
                {/* Icon */}
                <div
                  className={`inline-block p-4 rounded-lg bg-gradient-to-r ${product.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {product.icon}
                </div>

                {/* Content */}
                <h3
                  className="text-3xl font-bold mb-2"
                  style={{ color: "#FFFFFF" }}
                >
                  {product.name}
                </h3>
                <p className="text-lg mb-4" style={{ color: "#D23621" }}>
                  {product.tagline}
                </p>
                <p
                  className="mb-6 leading-relaxed"
                  style={{ color: "#CCCCCC" }}
                >
                  {product.description}
                </p>

                {/* Features */}
                <ul className="space-y-3">
                  {product.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center"
                      style={{ color: "#CCCCCC" }}
                    >
                      <FaCheck
                        className="w-5 h-5 mr-3 flex-shrink-0"
                        style={{ color: "#D23621" }}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-8 px-4 bg-gradient-to-b from-black via-red-900/10 to-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            One Platform,{" "}
            <span style={{ color: "#D23621" }}>Infinite Possibilities</span>
          </h2>
          <p
            className="text-xl mb-12 max-w-3xl mx-auto"
            style={{ color: "#CCCCCC" }}
          >
            Stop juggling a dozen subscriptions. Our tools work together
            seamlessly—generate content in Ninja Chat, create visuals in
            Imaginative Ninja, build your site, and schedule it all on social
            media.
          </p>

          {/* Integration Flow */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              "Research & Plan",
              "Design & Create",
              "Build & Launch",
              "Market & Grow",
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="rounded-lg p-6 transition-all duration-300 bg-[#151515] border border-[#333]">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto"
                    style={{
                      background:
                        "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)",
                    }}
                  >
                    {index + 1}
                  </div>
                  <p className="font-semibold">{step}</p>
                </div>
                {index < 3 && (
                  <div
                    className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5"
                    style={{
                      background:
                        "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)",
                    }}
                  ></div>
                )}
              </div>
            ))}
          </div>

          <Link
            to="/solutions"
            className="inline-block px-8 py-4 border-2 rounded-lg font-bold text-lg transition-all duration-300"
            style={{ borderColor: "#D23621" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            SEE HOW IT WORKS
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
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
            Ready to Build Your Dream?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of founders who've replaced their fragmented stack
            with one powerful platform.
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
            START BUILDING TODAY
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProductsMain;
