import React, { useState } from "react";
import { FaEnvelope, FaUser, FaComment, FaRocket } from "react-icons/fa";

const ContactMain: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

  };

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            We're <span style={{ color: "#D23621" }}>Here to Help</span>
          </h1>
          <p
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            style={{ color: "#CCCCCC" }}
          >
            Have a question? Need support? Our team responds within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div
            className="rounded-lg p-8"
            style={{
              background:
                "linear-gradient(135.17deg, rgba(55, 65, 81, 0.5) -94.55%, rgba(18, 16, 16, 0.5) 95.54%)",
            }}
          >
            <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-semibold mb-2 flex items-center">
                  <FaUser className="mr-2" style={{ color: "#D23621" }} />
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#151515] rounded-lg focus:outline-none transition-colors border border-[#333]"
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#D23621")
                  }
                  onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 flex items-center">
                  <FaEnvelope className="mr-2" style={{ color: "#D23621" }} />
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#151515] rounded-lg focus:outline-none transition-colors border border-[#333]"
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#D23621")
                  }
                  onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 flex items-center">
                  <FaComment className="mr-2" style={{ color: "#D23621" }} />
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#151515] rounded-lg focus:outline-none transition-colors border border-[#333]"
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#D23621")
                  }
                  onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Message *
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={6}
                  className="w-full px-4 py-3 bg-[#151515] rounded-lg focus:outline-none transition-colors resize-none border border-[#333]"
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "#D23621")
                  }
                  onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-lg font-bold text-lg hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)",
                }}
              >
                SEND MESSAGE
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">Other Ways to Reach Us</h2>

            <div className="space-y-6">
              <div
                className="rounded-lg p-6 border"
                style={{
                  background:
                    "linear-gradient(135.17deg, rgba(55, 65, 81, 0.5) -94.55%, rgba(18, 16, 16, 0.5) 95.54%)",
                  border: "1px solid #8B0000",
                }}
              >
                <div className="flex items-center mb-4">
                  <FaRocket
                    className="text-2xl mr-3"
                    style={{ color: "#D23621" }}
                  />
                  <h3 className="text-xl font-bold">Ninja Assist</h3>
                </div>
                <p className="mb-4" style={{ color: "#CCCCCC" }}>
                  Get instant answers from our AI support guide, available 24/7.
                </p>
                <button
                  className="transition-colors"
                  style={{ color: "#D23621" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#B91C1C")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#D23621")
                  }
                >
                  Open Chat →
                </button>
              </div>

              <div
                className="rounded-lg p-6 border"
                style={{
                  background:
                    "linear-gradient(135.17deg, rgba(55, 65, 81, 0.5) -94.55%, rgba(18, 16, 16, 0.5) 95.54%)",
                  border: "1px solid #8B0000",
                }}
              >
                <h3 className="text-xl font-bold mb-4">Email Support</h3>
                <p className="mb-2" style={{ color: "#CCCCCC" }}>
                  support@startupninja.com
                </p>
                <p className="text-sm" style={{ color: "#999" }}>
                  We respond within 24 hours
                </p>
              </div>

              <div
                className="rounded-lg p-6 border"
                style={{
                  background:
                    "linear-gradient(135.17deg, rgba(55, 65, 81, 0.5) -94.55%, rgba(18, 16, 16, 0.5) 95.54%)",
                  border: "1px solid #8B0000",
                }}
              >
                <h3 className="text-xl font-bold mb-4">Documentation</h3>
                <p className="mb-4" style={{ color: "#CCCCCC" }}>
                  Find answers in our comprehensive guides and tutorials.
                </p>
                <a
                  href="/documentation"
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
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactMain;
