import React, { useState } from "react";
import { FaUser, FaEnvelope, FaBuilding, FaClock } from "react-icons/fa";
import { apiClient } from "../../../services/apiClient";

const BookDemoMain: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiClient.post("/user/contact-email", {
        toEmail: "support@startupninja.ai",
        name: formData.name,
        email: formData.email,
        subject: `Demo Booking Request: ${formData.company || "No Company Specified"}`,
        message: `Company: ${formData.company || "N/A"}\n\nGoals/Learn details:\n${formData.message}`,
      });

      if (response.success) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          company: "",
          message: "",
        });
      } else {
        setError(response.message || "Failed to submit demo request. Please try again.");
      }
    } catch (err: any) {
      console.error("Failed to submit demo booking form", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit demo request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const demoFeatures = [
    "Personalized 30-minute walkthrough",
    "Live Q&A with product expert",
    "Custom setup assistance",
    "Exclusive onboarding resources",
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative pt-24 md:pt-32 pb-8 md:pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            See Startup Ninja{" "}
            <span style={{ color: "#D23621" }}>in Action</span>
          </h1>
          <p
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            style={{ color: "#CCCCCC" }}
          >
            Book a personalized demo and discover how Startup Ninja can
            transform your business.
          </p>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="rounded-2xl p-8 bg-[#141010] border border-white/10 shadow-lg">
            <h2 className="text-3xl font-bold mb-6">Book Your Demo</h2>

            {success && (
              <div className="p-4 mb-6 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg">
                ✅ Thank you! Your demo request has been submitted successfully. We will get back to you shortly.
              </div>
            )}
            {error && (
              <div className="p-4 mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center">
                  <FaUser className="mr-2" style={{ color: "#D23621" }} />
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  disabled={submitting}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#151515] rounded-lg focus:outline-none transition-colors border border-[#333] disabled:opacity-50"
                  placeholder="John Doe"
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#D23621")
                  }
                  onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center">
                  <FaEnvelope className="mr-2" style={{ color: "#D23621" }} />
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  disabled={submitting}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#151515] rounded-lg focus:outline-none transition-colors border border-[#333] disabled:opacity-50"
                  placeholder="john@company.com"
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#D23621")
                  }
                  onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center">
                  <FaBuilding className="mr-2" style={{ color: "#D23621" }} />
                  Company Name
                </label>
                <input
                  type="text"
                  disabled={submitting}
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#151515] rounded-lg focus:outline-none transition-colors border border-[#333] disabled:opacity-50"
                  placeholder="Your Company"
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#D23621")
                  }
                  onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  What would you like to learn about?
                </label>
                <textarea
                  disabled={submitting}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 bg-[#151515] rounded-lg focus:outline-none transition-colors resize-none border border-[#333] disabled:opacity-50"
                  placeholder="Tell us about your goals..."
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#D23621")
                  }
                  onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-lg font-bold text-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)",
                }}
              >
                {submitting ? "SUBMITTING..." : "BOOK DEMO"}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">What to Expect</h2>

            <div className="space-y-6 mb-8">
              {demoFeatures.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-4"
                    style={{
                      background:
                        "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)",
                    }}
                  >
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-lg">{feature}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-6 mb-6 bg-[#141010] border border-white/10 shadow-lg">
              <div className="flex items-center mb-4">
                <FaClock
                  className="text-2xl mr-3"
                  style={{ color: "#D23621" }}
                />
                <h3 className="text-xl font-bold">30-Minute Session</h3>
              </div>
              <p style={{ color: "#CCCCCC" }}>
                Our product experts will walk you through the entire platform,
                answer your questions, and help you get started.
              </p>
            </div>

            <div className="rounded-xl p-6 bg-[#141010] border border-white/10 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Perfect For:</h3>
              <ul className="space-y-3" style={{ color: "#CCCCCC" }}>
                <li>• Founders evaluating tools</li>
                <li>• Agencies looking to scale</li>
                <li>• Teams considering migration</li>
                <li>• Anyone with specific questions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prefer to Start on Your Own?
          </h2>
          <p className="text-xl mb-8" style={{ color: "#CCCCCC" }}>
            No demo needed. Start building for free today.
          </p>
          <a
            href="/login"
            className="inline-block px-8 py-4 rounded-lg font-bold text-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300"
            style={{
              background: "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)",
            }}
          >
            START FOR FREE
          </a>
        </div>
      </section>
    </div>
  );
};

export default BookDemoMain;
