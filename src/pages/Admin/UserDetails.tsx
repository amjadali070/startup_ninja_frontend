import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCreditCard,
  FaHistory,
  FaRobot,
  FaImage,
  FaGlobe,
  FaShareAlt,
  FaShieldAlt,
  FaKey,
  FaDesktop,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaHdd,
  FaBell,
  FaCog,
  FaExternalLinkAlt,
  FaTools,
} from "react-icons/fa";
import { adminService } from "../../services/admin";
import { authService } from "../../services/auth";
import { useAuth } from "../../hooks/useAuth";
import DashboardLayout from "../../layouts/DashboardLayout";
import type {
  ExtendedUserDetails,
} from "../../types/admin";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const PLAN_FEATURES = {
  Free: [
    "Limited AI Chat access",
    "50 AI credits/month",
    "Basic Image Generation",
    "1 Website project",
    "Startup Ninja subdomain",
    "Basic Social Media scheduling",
  ],
  Basic: [
    "Limited AI Chat access",
    "100 AI credits/month",
    "Standard Image Generation",
    "3 Website projects",
    "Startup Ninja subdomain",
    "Standard Social Media scheduling",
  ],
  Pro: [
    "Unlimited AI Chat",
    "500 AI credits/month",
    "Advanced Image Generation",
    "Unlimited website projects",
    "Custom domain support",
    "Full Social Media Pro access",
    "Priority email support",
    "SEO optimization tools",
  ],
  Enterprise: [
    "Everything in Pro",
    "2000 AI credits/month",
    "White-label options",
    "Team management (up to 10 users)",
    "Advanced analytics",
    "Priority phone support",
    "Custom integrations",
    "Dedicated account manager",
    "SLA guarantee",
  ],
};

const UserDetailsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  const [user, setUser] = useState<ExtendedUserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "profile" | "subscription" | "content" | "security"
  >("overview");
  const [viewingContent, setViewingContent] = useState<string | null>(null);
  const [viewingResources, setViewingResources] = useState(false);
  const [viewingEditUser, setViewingEditUser] = useState(false);
  const [resourceForm, setResourceForm] = useState({
    chatTokensLimit: 0,
    imageGenLimit: 0,
    websiteLimit: 0,
    socialPostLimit: 0,
    features: [] as string[],
  });
  const [editForm, setEditForm] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    country: "",
    role: "user",
    status: 1,
  });

  const handleLogout = async () => {
    try {
      const userData = {
        user: {
          userId: currentUser?.id || "",
        },
      };
      await authService.logout(userData);
      logout();
    } catch (error) {
      console.error("Logout failed:", error);
      logout();
    }
  };

  const handleOpenSettings = () => {
    navigate("/settings");
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const response = await adminService.getUserById(userId);

        if (response.success && response.data) {
          const plan = response.data.user.subscription || "Free";
          const features =
            PLAN_FEATURES[plan as keyof typeof PLAN_FEATURES] ||
            PLAN_FEATURES.Free;

          const extendedUser: ExtendedUserDetails = {
            ...response.data.user,
            subscription: {
              plan: plan,
              status: "active",
              startDate: "2024-01-01",
              nextBillingDate: "2024-02-01",
              amount:
                plan === "Pro" ? 29.99 : plan === "Enterprise" ? 99.99 : 0,
              interval: "month",
            },
            usage: {
              chatTokensUsed: Math.floor(
                Math.random() *
                  (plan === "Enterprise"
                    ? 150000
                    : plan === "Pro"
                    ? 80000
                    : 8000)
              ),
              chatTokensLimit:
                plan === "Enterprise"
                  ? 200000
                  : plan === "Pro"
                  ? 100000
                  : 10000,
              imageGenUsed: Math.floor(
                Math.random() *
                  (plan === "Enterprise" ? 400 : plan === "Pro" ? 150 : 15)
              ),
              imageGenLimit:
                plan === "Enterprise" ? 500 : plan === "Pro" ? 200 : 20,
              websiteUsed: Math.floor(
                Math.random() *
                  (plan === "Enterprise" ? 10 : plan === "Pro" ? 3 : 1)
              ),
              websiteLimit: plan === "Enterprise" || plan === "Pro" ? 999 : 1,
              socialPostsUsed: Math.floor(
                Math.random() *
                  (plan === "Enterprise" ? 500 : plan === "Pro" ? 50 : 5)
              ),
              socialPostLimit:
                plan === "Enterprise" ? 1000 : plan === "Pro" ? 100 : 10,
              periodStart: "2024-01-01",
              periodEnd: "2024-02-01",
            },
            contentStats: {
              totalChats:
                response.data.stats.totalChats ||
                Math.floor(Math.random() * 20),
              totalPosts:
                response.data.stats.totalPosts ||
                Math.floor(Math.random() * 10),
              totalWebsites:
                response.data.stats.totalWebsites ||
                Math.floor(Math.random() * 3),
              totalImages: Math.floor(Math.random() * 15),
            },
            transactions: Array.from({ length: 5 }).map((_, i) => ({
              id: `txn_${Math.random().toString(36).substr(2, 9)}`,
              date: new Date(
                Date.now() - i * 30 * 24 * 60 * 60 * 1000
              ).toISOString(),
              amount:
                plan === "Pro" ? 29.99 : plan === "Enterprise" ? 99.99 : 0,
              currency: "USD",
              status: "succeeded",
              description: `${plan} Plan Subscription`,
            })),
            activityLogs: Array.from({ length: 8 }).map((_, i) => ({
              id: `log_${Math.random().toString(36).substr(2, 9)}`,
              action: [
                "Login",
                "Password Update",
                "Profile Update",
                "API Key Created",
              ][Math.floor(Math.random() * 4)],
              ip: "192.168.1.1",
              userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
              timestamp: new Date(
                Date.now() - i * 2 * 24 * 60 * 60 * 1000
              ).toISOString(),
              details: "Successful operation",
            })),
            loginSessions: [
              {
                id: "sess_1",
                device: "Desktop (Windows)",
                browser: "Chrome",
                ip: "192.168.1.1",
                lastActive: new Date().toISOString(),
                isCurrent: true,
                location: "New York, USA",
              },
              {
                id: "sess_2",
                device: "Mobile (iPhone)",
                browser: "Safari",
                ip: "10.0.0.1",
                lastActive: new Date(
                  Date.now() - 24 * 60 * 60 * 1000
                ).toISOString(),
                isCurrent: false,
                location: "New York, USA",
              },
            ],
            features: features,
          };
          setUser(extendedUser);

          setResourceForm({
            chatTokensLimit: extendedUser.usage.chatTokensLimit,
            imageGenLimit: extendedUser.usage.imageGenLimit,
            websiteLimit: plan === "Enterprise" || plan === "Pro" ? 999 : 1,
            socialPostLimit:
              plan === "Enterprise" ? 1000 : plan === "Pro" ? 100 : 10,
            features: features,
          });

          setEditForm({
            fullname: extendedUser.fullname || "",
            email: extendedUser.email || "",
            phoneNumber: extendedUser.phoneNumber || "",
            country: extendedUser.country || "",
            role: extendedUser.role || "user",
            status: extendedUser.status,
          });
        } else {
          toast.error(response.message || "Failed to fetch user details");
          navigate("/admin-dashboard/users");
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch user details");
        navigate("/admin-dashboard/users");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewContent = (type: string) => {
    setViewingContent(type);
  };

  const closeContentHistory = () => {
    setViewingContent(null);
  };

  const handleUpdateResources = async () => {
    if (!user) return;

    setUser({
      ...user,
      usage: {
        ...user.usage,
        chatTokensLimit: resourceForm.chatTokensLimit,
        imageGenLimit: resourceForm.imageGenLimit,
      },
      features: resourceForm.features,
    });

    toast.success("User resources updated successfully");
    setViewingResources(false);
  };

  const handleUpdateUser = async () => {
    if (!user) return;

    // In a real app, API call here
    // await adminService.updateUser(user._id, editForm);

    setUser({
      ...user,
      fullname: editForm.fullname,
      email: editForm.email,
      phoneNumber: editForm.phoneNumber,
      country: editForm.country,
      role: editForm.role as "admin" | "user",
      status: editForm.status,
    });

    toast.success("User profile updated successfully");
    setViewingEditUser(false);
  };

  const toggleFeature = (feature: string) => {
    setResourceForm((prev) => {
      const exists = prev.features.includes(feature);
      return {
        ...prev,
        features: exists
          ? prev.features.filter((f) => f !== feature)
          : [...prev.features, feature],
      };
    });
  };

  const renderManageResourcesView = () => {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <button
            onClick={() => setViewingResources(false)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <FaArrowLeft /> Back to User Details
          </button>

          <div className="flex items-center justify-between bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <FaTools className="text-blue-500" /> Manage Resources
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Configure limits and feature access for{" "}
                {user?.fullname || user?.username}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setViewingResources(false)}
                className="px-4 py-2 bg-[#2A2A2A] hover:bg-[#333] text-white rounded-lg border border-[#333] transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateResources}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Limits Section */}
          <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
            <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
              <FaHdd className="text-green-500" /> Resource Limits
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  AI Chat Tokens Limit (tokens/mo)
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={resourceForm.chatTokensLimit}
                      onChange={(e) =>
                        setResourceForm({
                          ...resourceForm,
                          chatTokensLimit: Number(e.target.value),
                        })
                      }
                      className="w-full bg-[#0D0D0D] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Current usage: {user?.usage.chatTokensUsed.toLocaleString()}{" "}
                  tokens
                </p>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Image Generation Limit (images/mo)
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={resourceForm.imageGenLimit}
                      onChange={(e) =>
                        setResourceForm({
                          ...resourceForm,
                          imageGenLimit: Number(e.target.value),
                        })
                      }
                      className="w-full bg-[#0D0D0D] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Current usage: {user?.usage.imageGenUsed} images
                </p>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Website Projects Limit (projects)
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={resourceForm.websiteLimit}
                      onChange={(e) =>
                        setResourceForm({
                          ...resourceForm,
                          websiteLimit: Number(e.target.value),
                        })
                      }
                      className="w-full bg-[#0D0D0D] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Social Posts Limit (posts/mo)
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={resourceForm.socialPostLimit}
                      onChange={(e) =>
                        setResourceForm({
                          ...resourceForm,
                          socialPostLimit: Number(e.target.value),
                        })
                      }
                      className="w-full bg-[#0D0D0D] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
            <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
              <FaCheckCircle className="text-purple-500" /> Feature Access
            </h3>
            <div className="space-y-3">
              {[
                "Social Media Posting",
                "AI Post Generation",
                "Post Scheduling",
                "Website Hosting",
                "Custom Domain",
                "API Access",
                "Team Management",
                "Advanced Analytics",
                "Priority Support",
              ].map((feature) => (
                <label
                  key={feature}
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                    resourceForm.features.includes(feature)
                      ? "bg-blue-900/10 border-blue-500/50"
                      : "bg-[#0D0D0D] border-[#333] hover:border-[#444]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center border ${
                        resourceForm.features.includes(feature)
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "border-gray-600"
                      }`}
                    >
                      {resourceForm.features.includes(feature) && (
                        <FaCheckCircle className="text-xs" />
                      )}
                    </div>
                    <span
                      className={
                        resourceForm.features.includes(feature)
                          ? "text-white font-medium"
                          : "text-gray-400"
                      }
                    >
                      {feature}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={resourceForm.features.includes(feature)}
                    onChange={() => toggleFeature(feature)}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEditUserView = () => {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <button
            onClick={() => setViewingEditUser(false)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <FaArrowLeft /> Back to User Details
          </button>

          <div className="flex items-center justify-between bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <FaUser className="text-red-500" /> Edit User Profile
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Update personal information and account status
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setViewingEditUser(false)}
                className="px-4 py-2 bg-[#2A2A2A] hover:bg-[#333] text-white rounded-lg border border-[#333] transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424] max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-2">
                Full Name
              </label>
              <div className="flex items-center gap-3">
                <FaUser className="text-gray-500" />
                <input
                  type="text"
                  value={editForm.fullname}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fullname: e.target.value })
                  }
                  className="flex-1 bg-[#0D0D0D] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-2">
                Email Address
              </label>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-gray-500" />
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="flex-1 bg-[#0D0D0D] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Phone Number
              </label>
              <div className="flex items-center gap-3">
                <FaPhone className="text-gray-500" />
                <input
                  type="text"
                  value={editForm.phoneNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phoneNumber: e.target.value })
                  }
                  className="flex-1 bg-[#0D0D0D] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Location / Country
              </label>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-gray-500" />
                <input
                  type="text"
                  value={editForm.country}
                  onChange={(e) =>
                    setEditForm({ ...editForm, country: e.target.value })
                  }
                  className="flex-1 bg-[#0D0D0D] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="United States"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Account Role
              </label>
              <div className="relative">
                <select
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                  className="w-full bg-[#0D0D0D] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none appearance-none transition-colors"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <FaCog className="absolute right-4 top-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Account Status
              </label>
              <div className="relative">
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: Number(e.target.value) })
                  }
                  className="w-full bg-[#0D0D0D] border border-[#333] rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none appearance-none transition-colors"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                  <option value={2}>Suspended</option>
                </select>
                <FaCheckCircle className="absolute right-4 top-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContentHistoryView = () => {
    if (!viewingContent) return null;

    const getHistoryContent = () => {
      switch (viewingContent) {
        case "AI Chats":
          return (
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424] hover:border-[#444] transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-white font-semibold text-lg">
                      Project Strategy Discussion
                    </h4>
                    <span className="text-sm text-gray-500">
                      {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                    User: How can I optimize my marketing funnel? AI: To
                    optimize your marketing funnel, focus on these key areas:
                    Awareness, Interest, Decision, and Action...
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-500 border-t border-[#242424] pt-4">
                    <span className="flex items-center gap-2">
                      <FaRobot className="text-blue-500" /> GPT-4
                    </span>
                    <span>1,240 tokens used</span>
                    <span>12 messages</span>
                    <button className="ml-auto text-blue-400 hover:text-blue-300">
                      View Full Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        case "Social Posts":
          return (
            <div className="space-y-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        i % 2 === 0
                          ? "bg-blue-900/20 text-blue-400"
                          : "bg-pink-900/20 text-pink-400"
                      }`}
                    >
                      {i % 2 === 0 ? <FaShareAlt /> : <FaImage />}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {i % 2 === 0 ? "LinkedIn" : "Instagram"}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Posted on{" "}
                        {new Date(
                          Date.now() - i * 86400000
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="ml-auto px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                      Published
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Excited to announce our new product launch! 🚀 #startup
                    #tech #innovation
                  </p>
                  {i % 2 !== 0 && (
                    <div className="mb-4 rounded-lg overflow-hidden h-48 bg-gray-800">
                      <img
                        src={`https://picsum.photos/seed/${i + 50}/800/400`}
                        alt="Post content"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex gap-6 text-sm text-gray-500 border-t border-[#242424] pt-4">
                    <span>124 Likes</span>
                    <span>45 Comments</span>
                    <span>12 Shares</span>
                    <button className="ml-auto text-blue-400 hover:text-blue-300">
                      View Analytics
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        case "Websites":
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-[#2A2A2A] rounded-lg flex items-center justify-center text-gray-500">
                      <FaGlobe className="text-2xl" />
                    </div>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                      Live
                    </span>
                  </div>
                  <h4 className="text-white font-bold text-lg mb-1">
                    Portfolio Site {i + 1}
                  </h4>
                  <a
                    href="#"
                    className="text-blue-400 text-sm hover:underline flex items-center gap-1 mb-4"
                  >
                    portfolio-{i + 1}.startupninja.app{" "}
                    <FaExternalLinkAlt className="text-xs" />
                  </a>
                  <div className="mt-auto pt-4 border-t border-[#242424] flex justify-between text-sm text-gray-500">
                    <span>Updated 2d ago</span>
                    <button className="text-white hover:text-blue-400">
                      Edit Site
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        case "Generated Images":
          return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="group relative aspect-square bg-[#1A1A1A] rounded-xl overflow-hidden border border-[#242424]"
                >
                  <img
                    src={`https://picsum.photos/seed/${i + 123}/500/500`}
                    alt="Generated"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <p className="text-white text-sm line-clamp-3 mb-2">
                      A futuristic city skyline with neon lights and flying
                      cars, cyberpunk style
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>1024x1024</span>
                      <button className="text-blue-400 hover:text-white">
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        default:
          return (
            <div className="text-gray-400 text-center py-8">
              No content found
            </div>
          );
      }
    };

    return (
      <div className="p-4 sm:p-6 max-w-full mx-auto animate-fade-in">
        <div className="mb-8">
          <button
            onClick={closeContentHistory}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <FaArrowLeft /> Back to User Details
          </button>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#1A1A1A] rounded-xl border border-[#242424]">
              {viewingContent === "AI Chats" && (
                <FaRobot className="text-blue-500 text-2xl" />
              )}
              {viewingContent === "Social Posts" && (
                <FaShareAlt className="text-pink-500 text-2xl" />
              )}
              {viewingContent === "Websites" && (
                <FaGlobe className="text-green-500 text-2xl" />
              )}
              {viewingContent === "Generated Images" && (
                <FaImage className="text-purple-500 text-2xl" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {viewingContent} History
              </h1>
              <p className="text-gray-400 text-sm">
                Viewing all {viewingContent?.toLowerCase()} for{" "}
                {user?.fullname || user?.username}
              </p>
            </div>
          </div>
        </div>

        {getHistoryContent()}
      </div>
    );
  };

  const renderOverviewTab = () => {
    if (!user) return null;
    return (
      <div className="space-y-6">
        {/* Usage Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* AI Chat Usage */}
          <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <FaRobot className="text-blue-500" /> AI Chat
              </h3>
              <span className="text-gray-400 text-sm">
                {Math.round(
                  (user.usage.chatTokensUsed / user.usage.chatTokensLimit) * 100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-[#2A2A2A] rounded-full h-2.5 mb-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (user.usage.chatTokensUsed / user.usage.chatTokensLimit) *
                      100
                  )}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>
                {user.usage.chatTokensUsed.toLocaleString()} /{" "}
                {user.usage.chatTokensLimit.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Image Generation */}
          <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <FaImage className="text-purple-500" /> Images
              </h3>
              <span className="text-gray-400 text-sm">
                {Math.round(
                  (user.usage.imageGenUsed / user.usage.imageGenLimit) * 100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-[#2A2A2A] rounded-full h-2.5 mb-2 overflow-hidden">
              <div
                className="bg-purple-600 h-2.5 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (user.usage.imageGenUsed / user.usage.imageGenLimit) * 100
                  )}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>
                {user.usage.imageGenUsed} / {user.usage.imageGenLimit}
              </span>
            </div>
          </div>

          {/* Website Hosting */}
          <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <FaGlobe className="text-green-500" /> Websites
              </h3>
              <span className="text-gray-400 text-sm">
                {Math.round(
                  ((user.usage.websiteUsed || 0) /
                    (user.usage.websiteLimit || 1)) *
                    100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-[#2A2A2A] rounded-full h-2.5 mb-2 overflow-hidden">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    ((user.usage.websiteUsed || 0) /
                      (user.usage.websiteLimit || 1)) *
                      100
                  )}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>
                {user.usage.websiteUsed || 0} / {user.usage.websiteLimit || 1}
              </span>
            </div>
          </div>

          {/* Social Media Posting */}
          <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <FaShareAlt className="text-pink-500" /> Social Posts
              </h3>
              <span className="text-gray-400 text-sm">
                {Math.round(
                  ((user.usage.socialPostsUsed || 0) /
                    (user.usage.socialPostLimit || 1)) *
                    100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-[#2A2A2A] rounded-full h-2.5 mb-2 overflow-hidden">
              <div
                className="bg-pink-600 h-2.5 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    ((user.usage.socialPostsUsed || 0) /
                      (user.usage.socialPostLimit || 1)) *
                      100
                  )}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>
                {user.usage.socialPostsUsed || 0} /{" "}
                {user.usage.socialPostLimit || 1}
              </span>
            </div>
          </div>
        </div>

        {/* Allowed Features */}
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
          <h3 className="text-white font-semibold mb-4">
            Allowed Features ({user.subscription.plan})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {user.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-[#2A2A2A] text-gray-300 rounded-lg border border-[#333]"
              >
                <FaCheckCircle className="text-green-500 text-sm flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
          <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {user.activityLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 pb-4 border-b border-[#242424] last:border-0 last:pb-0"
              >
                <div className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                  <FaHistory className="text-gray-400 text-xs" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{log.action}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {formatDate(log.timestamp)}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderProfileTab = () => {
    if (!user) return null;
    return (
      <div className="space-y-6">
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
          <h3 className="text-white font-semibold mb-6">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-500 text-sm mb-1">
                Full Name
              </label>
              <div className="text-white">{user.fullname || "N/A"}</div>
            </div>
            <div>
              <label className="block text-gray-500 text-sm mb-1">
                Email Address
              </label>
              <div className="text-white flex items-center gap-2">
                {user.email}
                {user.isEmailVerified ? (
                  <FaCheckCircle
                    className="text-green-500 text-sm"
                    title="Verified"
                  />
                ) : (
                  <FaTimesCircle
                    className="text-red-500 text-sm"
                    title="Not Verified"
                  />
                )}
              </div>
            </div>
            <div>
              <label className="block text-gray-500 text-sm mb-1">
                Phone Number
              </label>
              <div className="text-white">{user.phoneNumber || "N/A"}</div>
            </div>
            <div>
              <label className="block text-gray-500 text-sm mb-1">
                Location
              </label>
              <div className="text-white">{user.country || "N/A"}</div>
            </div>
            <div>
              <label className="block text-gray-500 text-sm mb-1">
                Joined Date
              </label>
              <div className="text-white">{formatDate(user.createdAt)}</div>
            </div>
            <div>
              <label className="block text-gray-500 text-sm mb-1">
                Login Method
              </label>
              <div className="text-white">{user.loginType}</div>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
          <h3 className="text-white font-semibold mb-6">Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <FaGlobe className="text-gray-400" />
              <div>
                <p className="text-gray-500 text-xs">Language</p>
                <p className="text-white text-sm">English (US)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaBell className="text-gray-400" />
              <div>
                <p className="text-gray-500 text-xs">Notifications</p>
                <p className="text-white text-sm">Enabled</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaCog className="text-gray-400" />
              <div>
                <p className="text-gray-500 text-xs">Theme</p>
                <p className="text-white text-sm">Dark Mode</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
          <h3 className="text-white font-semibold mb-6">Login Sessions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#242424]">
                  <th className="pb-3 text-gray-400 font-medium text-sm">
                    Device
                  </th>
                  <th className="pb-3 text-gray-400 font-medium text-sm">
                    Location
                  </th>
                  <th className="pb-3 text-gray-400 font-medium text-sm">
                    IP Address
                  </th>
                  <th className="pb-3 text-gray-400 font-medium text-sm">
                    Last Active
                  </th>
                  <th className="pb-3 text-gray-400 font-medium text-sm">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {user.loginSessions.map((session) => (
                  <tr
                    key={session.id}
                    className="border-b border-[#242424] last:border-0"
                  >
                    <td className="py-4 text-white text-sm">
                      {session.device} ({session.browser})
                    </td>
                    <td className="py-4 text-gray-300 text-sm">
                      {session.location}
                    </td>
                    <td className="py-4 text-gray-300 text-sm">{session.ip}</td>
                    <td className="py-4 text-gray-300 text-sm">
                      {formatDate(session.lastActive)}
                    </td>
                    <td className="py-4">
                      {session.isCurrent ? (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                          Current
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">Inactive</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderSubscriptionTab = () => {
    if (!user) return null;
    return (
      <div className="space-y-6">
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
          <div className="flex justify-between items-start border-b border-[#242424] pb-6">
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">
                Current Plan
              </h3>
              <p className="text-gray-400 text-sm">
                Manage subscription and billing
              </p>
            </div>
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide ${
                user.subscription.plan === "Enterprise"
                  ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                  : user.subscription.plan === "Pro"
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "bg-gray-600/20 text-gray-400 border border-gray-500/30"
              }`}
            >
              {user.subscription.plan}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
            <div className="bg-[#2A2A2A] p-4 rounded-lg border border-[#333] flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  user.subscription.status === "active"
                    ? "bg-green-500/20 text-green-500"
                    : "bg-red-500/20 text-red-500"
                }`}
              >
                {user.subscription.status === "active" ? (
                  <FaCheckCircle />
                ) : (
                  <FaTimesCircle />
                )}
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                  Status
                </p>
                <p
                  className={`font-bold capitalize ${
                    user.subscription.status === "active"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {user.subscription.status}
                </p>
              </div>
            </div>

            <div className="bg-[#2A2A2A] p-4 rounded-lg border border-[#333] flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                <FaCalendarAlt />
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                  Next Billing
                </p>
                <p className="text-white font-bold">
                  {new Date(
                    user.subscription.nextBillingDate
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="bg-[#2A2A2A] p-4 rounded-lg border border-[#333] flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center">
                <FaCreditCard />
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                  Amount
                </p>
                <p className="text-white font-bold text-lg">
                  ${user.subscription.amount}
                  <span className="text-sm text-gray-500 font-normal">
                    /{user.subscription.interval}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
          <h3 className="text-white font-semibold mb-6">Transaction History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#242424]">
                  <th className="pb-3 text-gray-400 font-medium text-sm">
                    Date
                  </th>
                  <th className="pb-3 text-gray-400 font-medium text-sm">
                    Description
                  </th>
                  <th className="pb-3 text-gray-400 font-medium text-sm">
                    Amount
                  </th>
                  <th className="pb-3 text-gray-400 font-medium text-sm">
                    Status
                  </th>
                  <th className="pb-3 text-gray-400 font-medium text-sm">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody>
                {user.transactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="border-b border-[#242424] last:border-0"
                  >
                    <td className="py-4 text-white text-sm">
                      {new Date(txn.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-gray-300 text-sm">
                      {txn.description}
                    </td>
                    <td className="py-4 text-white font-medium text-sm">
                      ${txn.amount}
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs capitalize ${
                          txn.status === "succeeded"
                            ? "bg-green-500/20 text-green-400"
                            : txn.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderContentTab = () => {
    if (!user) return null;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424] flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center mb-4">
            <FaRobot className="text-blue-500 text-xl" />
          </div>
          <h3 className="text-white font-bold text-2xl">
            {user.contentStats.totalChats}
          </h3>
          <p className="text-gray-400 text-sm mt-1">AI Chats</p>
          <button
            onClick={() => handleViewContent("AI Chats")}
            className="mt-4 text-blue-400 text-sm hover:underline"
          >
            View History
          </button>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424] flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-pink-600/20 flex items-center justify-center mb-4">
            <FaShareAlt className="text-pink-500 text-xl" />
          </div>
          <h3 className="text-white font-bold text-2xl">
            {user.contentStats.totalPosts}
          </h3>
          <p className="text-gray-400 text-sm mt-1">Social Posts</p>
          <button
            onClick={() => handleViewContent("Social Posts")}
            className="mt-4 text-blue-400 text-sm hover:underline"
          >
            View Posts
          </button>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424] flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center mb-4">
            <FaGlobe className="text-green-500 text-xl" />
          </div>
          <h3 className="text-white font-bold text-2xl">
            {user.contentStats.totalWebsites}
          </h3>
          <p className="text-gray-400 text-sm mt-1">Websites</p>
          <button
            onClick={() => handleViewContent("Websites")}
            className="mt-4 text-blue-400 text-sm hover:underline"
          >
            View Sites
          </button>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424] flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center mb-4">
            <FaImage className="text-purple-500 text-xl" />
          </div>
          <h3 className="text-white font-bold text-2xl">
            {user.contentStats.totalImages}
          </h3>
          <p className="text-gray-400 text-sm mt-1">Generated Images</p>
          <button
            onClick={() => handleViewContent("Generated Images")}
            className="mt-4 text-blue-400 text-sm hover:underline"
          >
            View Gallery
          </button>
        </div>
      </div>
    );
  };

  const renderSecurityTab = () => {
    if (!user) return null;
    return (
      <div className="space-y-6">
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
          <h3 className="text-white font-semibold mb-6">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-lg">
              <div className="flex items-center gap-3">
                <FaKey className="text-yellow-500" />
                <div>
                  <p className="text-white font-medium">Password</p>
                  <p className="text-gray-400 text-xs">
                    Last changed 3 months ago
                  </p>
                </div>
              </div>
              <button className="text-blue-400 text-sm hover:underline">
                Reset Password
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-lg">
              <div className="flex items-center gap-3">
                <FaShieldAlt className="text-green-500" />
                <div>
                  <p className="text-white font-medium">
                    Two-Factor Authentication
                  </p>
                  <p className="text-gray-400 text-xs">Currently disabled</p>
                </div>
              </div>
              <button className="text-blue-400 text-sm hover:underline">
                Enable
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
          <h3 className="text-white font-semibold mb-6">Activity Logs</h3>
          <div className="space-y-4">
            {user.activityLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 pb-4 border-b border-[#242424] last:border-0 last:pb-0"
              >
                <div className="w-2 h-2 mt-2 rounded-full bg-gray-500"></div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-white text-sm font-medium">
                      {log.action}
                    </p>
                    <span className="text-gray-500 text-xs">
                      {formatDate(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    IP: {log.ip} • {log.userAgent}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout
      activePath="/admin-dashboard/users"
      title="User Details"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <div className="p-4 sm:p-6 max-w-full mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <LoadingSpinner />
          </div>
        ) : viewingResources ? (
          renderManageResourcesView()
        ) : viewingEditUser ? (
          renderEditUserView()
        ) : viewingContent ? (
          renderContentHistoryView()
        ) : !user ? (
          <div className="text-center text-gray-400 mt-20">User not found</div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => navigate("/admin-dashboard/users")}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
              >
                <FaArrowLeft /> Back to Users
              </button>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
                <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-3xl text-white font-bold">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    user.username.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {user.fullname || user.username}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <FaEnvelope /> {user.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaUser /> {user.role}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        user.status === 1
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {user.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setViewingResources(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                  >
                    <FaTools /> Manage Resources
                  </button>
                  <button
                    onClick={() => setViewingEditUser(true)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Edit User
                  </button>
                  <button className="px-4 py-2 bg-[#2A2A2A] hover:bg-[#333] text-white rounded-lg border border-[#333] transition-colors font-medium">
                    Suspend
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-[#242424] mb-6 gap-6">
              {[
                { id: "overview", label: "Overview", icon: FaDesktop },
                { id: "profile", label: "Profile", icon: FaUser },
                {
                  id: "subscription",
                  label: "Subscription",
                  icon: FaCreditCard,
                },
                { id: "content", label: "Content", icon: FaImage },
                { id: "security", label: "Security & Logs", icon: FaShieldAlt },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 pb-4 px-2 text-sm font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-red-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <tab.icon />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 rounded-t-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === "overview" && renderOverviewTab()}
              {activeTab === "profile" && renderProfileTab()}
              {activeTab === "subscription" && renderSubscriptionTab()}
              {activeTab === "content" && renderContentTab()}
              {activeTab === "security" && renderSecurityTab()}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserDetailsPage;
