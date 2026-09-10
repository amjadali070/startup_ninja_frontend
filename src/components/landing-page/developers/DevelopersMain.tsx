import React from "react";
import { Link } from "react-router-dom";
import {
  FaCode,
  FaRocket,
  FaMagic,
  FaLayerGroup,
  FaGlobe,
  FaLock,
} from "react-icons/fa";

const DevelopersMain: React.FC = () => {
  const features = [
    {
      icon: <FaRocket className="w-10 h-10" />,
      title: "3-Step AI Wizard",
      description:
        "Tell Ninja about your business, pick a vibe and template, then preview an AI-filled draft before you publish.",
    },
    {
      icon: <FaCode className="w-10 h-10" />,
      title: "Drag-and-Drop Editor",
      description:
        "Add and rearrange sections, edit text and images directly, and pull from a library of ready-made components.",
    },
    {
      icon: <FaMagic className="w-10 h-10" />,
      title: "AI Section Editing",
      description:
        "Select any element and click Ask Ninja to describe a change in plain language instead of editing it by hand.",
    },
    {
      icon: <FaLayerGroup className="w-10 h-10" />,
      title: "28 Ready-Made Templates",
      description:
        "Start from a template matched to your industry and vibe, pre-filled with your business name and logo.",
    },
    {
      icon: <FaGlobe className="w-10 h-10" />,
      title: "Custom Domain",
      description:
        "Connect a domain you already own, with automatic setup for GoDaddy and Namecheap or manual DNS records.",
    },
    {
      icon: <FaLock className="w-10 h-10" />,
      title: "Automatic SSL",
      description:
        "A security certificate is issued automatically once your domain is verified, usually within minutes.",
    },
  ];

  const buildSteps = [
    {
      step: "1",
      title: "Choose Your Template",
      description: "Start with a professional template or begin from scratch",
    },
    {
      step: "2",
      title: "Drag & Drop Elements",
      description:
        "Add text, images, buttons, and more with simple drag-and-drop",
    },
    {
      step: "3",
      title: "Customize Your Design",
      description: "Change colors, fonts, and layouts to match your brand",
    },
    {
      step: "4",
      title: "Publish Instantly",
      description:
        "Click publish and your site goes live with free hosting and SSL",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Build <span style={{ color: "#D23621" }}>Without Limits</span>
          </h1>
          <p
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            style={{ color: "#CCCCCC" }}
          >
            Professional websites in minutes, not months. No coding required and
            no technical barriers, just your idea brought to life.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 rounded-lg font-bold text-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300"
            style={{
              background: "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)",
            }}
          >
            START BUILDING
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Enterprise Features,{" "}
              <span style={{ color: "#D23621" }}>Zero Complexity</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group rounded-2xl p-8 bg-[#141010] border border-white/10 shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <div
                  className="mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ color: "#D23621" }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p style={{ color: "#CCCCCC" }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gradient-to-b from-black via-red-900/10 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              From Idea to <span style={{ color: "#D23621" }}>Live Site</span>{" "}
              in 4 Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {buildSteps.map((item, index) => (
              <div key={index} className="relative">
                <div className="rounded-xl p-6 text-center bg-[#141010] border border-white/10 shadow-lg hover:scale-105 transition-transform duration-300">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto"
                    style={{
                      background:
                        "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)",
                    }}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                  <p className="text-sm" style={{ color: "#CCCCCC" }}>
                    {item.description}
                  </p>
                </div>
                {index < 3 && (
                  <div
                    className="hidden md:block absolute top-28 -right-6 w-6 h-0.5"
                    style={{
                      background:
                        "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)",
                    }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl p-12 bg-[#141010] border border-white/10 shadow-lg">
            <h2 className="text-4xl font-bold mb-6 text-center">
              Built-In Integration
            </h2>
            <p
              className="text-xl text-center mb-8"
              style={{ color: "#CCCCCC" }}
            >
              Your Web Builder works perfectly with your other Startup Ninja
              tools
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl bg-[#141010] border border-white/10 shadow-lg hover:scale-105 transition-transform duration-300">
                <p className="text-3xl mb-3">💬</p>
                <h4 className="font-bold mb-2">Ninja Chat</h4>
                <p className="text-sm" style={{ color: "#CCCCCC" }}>
                  Generate copy and paste directly into your site
                </p>
              </div>
              <div className="text-center p-6 rounded-xl bg-[#141010] border border-white/10 shadow-lg hover:scale-105 transition-transform duration-300">
                <p className="text-3xl mb-3">🎨</p>
                <h4 className="font-bold mb-2">Imaginative Ninja</h4>
                <p className="text-sm" style={{ color: "#CCCCCC" }}>
                  Create images and upload to your Brand Library
                </p>
              </div>
              <div className="text-center p-6 rounded-xl bg-[#141010] border border-white/10 shadow-lg hover:scale-105 transition-transform duration-300">
                <p className="text-3xl mb-3">📱</p>
                <h4 className="font-bold mb-2">Social Media Pro</h4>
                <p className="text-sm" style={{ color: "#CCCCCC" }}>
                  Drive traffic from social to your new site
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
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
            Ready to Launch Your Site?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            No credit card required. Start building your professional website
            today.
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

export default DevelopersMain;
