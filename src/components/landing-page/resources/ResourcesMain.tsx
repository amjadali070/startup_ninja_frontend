import React from "react";
import { Link } from "react-router-dom";
import {
  FaBook,
  FaVideo,
  FaQuestionCircle,
  FaFileAlt,
  FaEnvelope,
} from "react-icons/fa";

const ResourcesMain: React.FC = () => {
  const resourceCategories = [
    {
      icon: <FaBook className="w-10 h-10" />,
      title: "Documentation",
      description: "Complete guides for every feature",
      link: "/documentation",
      color: "from-red-600 to-orange-600",
    },
    {
      icon: <FaVideo className="w-10 h-10" />,
      title: "Video Tutorials",
      description: "Step-by-step video walkthroughs (Coming Soon)",
      link: "/documentation",
      color: "from-orange-600 to-red-600",
    },
    {
      icon: <FaFileAlt className="w-10 h-10" />,
      title: "Templates",
      description: "Ready-to-use website templates",
      link: "/documentation",
      color: "from-red-600 to-pink-600",
    },
    {
      icon: <FaQuestionCircle className="w-10 h-10" />,
      title: "FAQs",
      description: "Answers to common questions",
      link: "/faq",
      color: "from-pink-600 to-red-600",
    },
  ];

  const popularResources = [
    {
      category: "Getting Started",
      title: "Quick Start Guide",
      description: "Get up and running in 5 minutes",
      readTime: "5 min read",
    },
    {
      category: "AI Chat",
      title: "How to Write Effective Prompts",
      description: "Master the art of AI communication",
      readTime: "8 min read",
    },
    {
      category: "Image Generation",
      title: "Creating Your Brand Identity",
      description: "Generate logos and brand assets",
      readTime: "10 min read",
    },
    {
      category: "Web Builder",
      title: "Building Your First Website",
      description: "From blank page to published site",
      readTime: "15 min read",
    },
    {
      category: "Social Media",
      title: "Automating Your Content Calendar",
      description: "Schedule a month of posts in one hour",
      readTime: "12 min read",
    },
    {
      category: "Best Practices",
      title: "SEO Optimization Tips",
      description: "Get found on Google faster",
      readTime: "10 min read",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-8 md:pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Master Your <span style={{ color: "#D23621" }}>AI Co-Founder</span>
          </h1>
          <p
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            style={{ color: "#CCCCCC" }}
          >
            Everything you need to become a Startup Ninja: guides, tutorials,
            templates, and support.
          </p>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resourceCategories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="group text-center rounded-xl p-8 bg-[#141010] border border-white/10 shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <div
                  className={`inline-block p-4 rounded-lg bg-gradient-to-r ${category.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {category.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{category.title}</h3>
                <p style={{ color: "#CCCCCC" }}>{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Resources */}
      <section className="py-16 px-4 bg-gradient-to-b from-black via-red-900/10 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Popular <span style={{ color: "#D23621" }}>Resources</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularResources.map((resource, index) => (
              <div
                key={index}
                className="group rounded-xl p-6 bg-[#141010] border border-white/10 shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                <div
                  className="text-sm font-semibold mb-2"
                  style={{ color: "#D23621" }}
                >
                  {resource.category}
                </div>
                <h3 className="text-xl font-bold mb-3">{resource.title}</h3>
                <p className="mb-4" style={{ color: "#CCCCCC" }}>
                  {resource.description}
                </p>
                <div className="text-sm" style={{ color: "#999" }}>
                  {resource.readTime}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl p-12 bg-[#141010] border border-white/10 shadow-lg">
            <h2 className="text-4xl font-bold mb-6 text-center">Need Help?</h2>
            <p
              className="text-xl text-center mb-12"
              style={{ color: "#CCCCCC" }}
            >
              Our support team is here to help you succeed
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div
                  className="inline-block p-4 rounded-full mb-4"
                  style={{
                    background:
                      "radial-gradient(50% 50% at 50% 50%, rgba(222, 5, 0, 0.7) 0%, rgba(120, 3, 0, 0) 100%)",
                  }}
                >
                  <FaBook className="w-8 h-8" style={{ color: "#D23621" }} />
                </div>
                <h4 className="font-bold mb-2">Documentation</h4>
                <p className="text-sm mb-4" style={{ color: "#CCCCCC" }}>
                  Browse guides for every feature
                </p>
                <Link
                  to="/documentation"
                  className="transition-colors"
                  style={{ color: "#D23621" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#B91C1C")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#D23621")
                  }
                >
                  Browse Docs →
                </Link>
              </div>

              <div className="text-center">
                <div
                  className="inline-block p-4 rounded-full mb-4"
                  style={{
                    background:
                      "radial-gradient(50% 50% at 50% 50%, rgba(222, 5, 0, 0.7) 0%, rgba(120, 3, 0, 0) 100%)",
                  }}
                >
                  <FaQuestionCircle
                    className="w-8 h-8"
                    style={{ color: "#D23621" }}
                  />
                </div>
                <h4 className="font-bold mb-2">FAQ</h4>
                <p className="text-sm mb-4" style={{ color: "#CCCCCC" }}>
                  Quick answers to common questions
                </p>
                <Link
                  to="/faq"
                  className="transition-colors"
                  style={{ color: "#D23621" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#B91C1C")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#D23621")
                  }
                >
                  View FAQ →
                </Link>
              </div>

              <div className="text-center">
                <div
                  className="inline-block p-4 rounded-full mb-4"
                  style={{
                    background:
                      "radial-gradient(50% 50% at 50% 50%, rgba(222, 5, 0, 0.7) 0%, rgba(120, 3, 0, 0) 100%)",
                  }}
                >
                  <FaEnvelope
                    className="w-8 h-8"
                    style={{ color: "#D23621" }}
                  />
                </div>
                <h4 className="font-bold mb-2">Email Support</h4>
                <p className="text-sm mb-4" style={{ color: "#CCCCCC" }}>
                  Get help from our team
                </p>
                <Link
                  to="/contact"
                  className="transition-colors"
                  style={{ color: "#D23621" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#B91C1C")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#D23621")
                  }
                >
                  Contact Us →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8" style={{ color: "#CCCCCC" }}>
            Explore our resources and start building your dream today.
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

export default ResourcesMain;
