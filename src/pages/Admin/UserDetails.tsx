import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
// @ts-ignore - remark-gfm v4 ESM compatibility issue
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
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
  FaSpinner,
  FaClock,
} from "react-icons/fa";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";
import { adminService } from "../../services/admin";
import { authService } from "../../services/auth";
import { useAuth } from "../../hooks/useAuth";
import DashboardLayout from "../../layouts/DashboardLayout";
import type {
  ExtendedUserDetails,
  AIChat,
  SocialPost,
  Website,
} from "../../types/admin";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

const WEB_BUILDER_SERVICE_URL = import.meta.env.VITE_WEB_BUILDER_SERVICE_URL;

const PLATFORM_META: Record<
  string,
  { icon: React.ElementType; color: string; name: string; bgClass: string }
> = {
  facebook: {
    icon: FaFacebook,
    color: "#1877F2",
    name: "Facebook",
    bgClass: "bg-[#1877F2]/10",
  },
  instagram: {
    icon: FaInstagram,
    color: "#E4405F",
    name: "Instagram",
    bgClass: "bg-[#E4405F]/10",
  },
  x: {
    icon: FaXTwitter,
    color: "#000000",
    name: "X",
    bgClass: "bg-gray-800/20",
  },
  twitter: {
    icon: FaXTwitter,
    color: "#1DA1F2",
    name: "Twitter",
    bgClass: "bg-[#1DA1F2]/10",
  },
  linkedin: {
    icon: FaLinkedin,
    color: "#0A66C2",
    name: "LinkedIn",
    bgClass: "bg-[#0A66C2]/10",
  },
};

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
  const [searchParams, setSearchParams] = useSearchParams();
  const { user: currentUser, logout } = useAuth();
  const [user, setUser] = useState<ExtendedUserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize state from URL parameters
  const [activeTab, setActiveTab] = useState<
    "overview" | "profile" | "subscription" | "content" | "security"
  >((searchParams.get("tab") as any) || "overview");
  const [viewingContent, setViewingContent] = useState<string | null>(
    searchParams.get("view") || null
  );
  const [viewingResources, setViewingResources] = useState(
    searchParams.get("mode") === "resources"
  );
  const [viewingEditUser, setViewingEditUser] = useState(
    searchParams.get("mode") === "edit"
  );
  const [selectedChat, setSelectedChat] = useState<AIChat | null>(null);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);

  // Content data state
  const [contentData, setContentData] = useState<{
    aiChats: AIChat[];
    socialPosts: SocialPost[];
    websites: Website[];
  }>({
    aiChats: [],
    socialPosts: [],
    websites: [],
  });
  const [contentLoading, setContentLoading] = useState(false);
  const [contentPage, setContentPage] = useState(1);
  const [contentTotalPages, setContentTotalPages] = useState(1);

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

  // Sync state changes to URL
  useEffect(() => {
    const params = new URLSearchParams();

    if (activeTab !== "overview") {
      params.set("tab", activeTab);
    }

    if (viewingContent) {
      params.set("view", viewingContent);
    }

    if (viewingResources) {
      params.set("mode", "resources");
    } else if (viewingEditUser) {
      params.set("mode", "edit");
    }

    setSearchParams(params, { replace: true });
  }, [
    activeTab,
    viewingContent,
    viewingResources,
    viewingEditUser,
    setSearchParams,
  ]);

  // Fetch content data when viewingContent changes (including on page load with URL params)
  useEffect(() => {
    if (viewingContent && userId && user) {
      fetchContentData(viewingContent, contentPage);
    }
  }, [viewingContent, userId, user]);

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

          // Fetch actual content counts
          const [aiChatsRes, socialPostsRes, websitesRes] = await Promise.all([
            adminService.getUserAIChats(userId, { page: 1, limit: 1 }),
            adminService.getUserSocialPosts(userId, { page: 1, limit: 1 }),
            adminService.getUserWebsites(userId, { page: 1, limit: 1 }),
          ]);

          const totalChats =
            aiChatsRes.success && aiChatsRes.data
              ? aiChatsRes.data.pagination.total
              : response.data.stats.totalChats || 0;

          const totalPosts =
            socialPostsRes.success && socialPostsRes.data
              ? socialPostsRes.data.pagination.total
              : response.data.stats.totalPosts || 0;

          const totalWebsites =
            websitesRes.success && websitesRes.data
              ? websitesRes.data.pagination.total
              : response.data.stats.totalWebsites || 0;

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
              websiteUsed: totalWebsites,
              websiteLimit: plan === "Enterprise" || plan === "Pro" ? 999 : 1,
              socialPostsUsed: totalPosts,
              socialPostLimit:
                plan === "Enterprise" ? 1000 : plan === "Pro" ? 100 : 10,
              periodStart: "2024-01-01",
              periodEnd: "2024-02-01",
            },
            contentStats: {
              totalChats: totalChats,
              totalPosts: totalPosts,
              totalWebsites: totalWebsites,
              totalImages: 0, // Image generation not implemented yet
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

  const handleViewContent = async (type: string) => {
    setViewingContent(type);
    setContentPage(1);
    await fetchContentData(type, 1);
  };

  const fetchContentData = async (type: string, page: number = 1) => {
    if (!userId) return;

    setContentLoading(true);
    try {
      if (type === "AI Chats") {
        const response = await adminService.getUserAIChats(userId, {
          page,
          limit: 20,
        });
        if (response.success && response.data) {
          setContentData((prev) => ({ ...prev, aiChats: response.data!.data }));
          setContentTotalPages(response.data.pagination.pages);
        }
      } else if (type === "Social Posts") {
        const response = await adminService.getUserSocialPosts(userId, {
          page,
          limit: 20,
        });
        if (response.success && response.data) {
          setContentData((prev) => ({
            ...prev,
            socialPosts: response.data!.data,
          }));
          setContentTotalPages(response.data.pagination.pages);
        }
      } else if (type === "Websites") {
        const response = await adminService.getUserWebsites(userId, {
          page,
          limit: 20,
        });
        if (response.success && response.data) {
          setContentData((prev) => ({
            ...prev,
            websites: response.data!.data,
          }));
          setContentTotalPages(response.data.pagination.pages);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch content");
    } finally {
      setContentLoading(false);
    }
  };

  const handleContentPageChange = async (newPage: number) => {
    if (!viewingContent) return;
    setContentPage(newPage);
    await fetchContentData(viewingContent, newPage);
  };

  const closeContentHistory = () => {
    setViewingContent(null);
    setSelectedChat(null);
    setSelectedPost(null);
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

    // Render detailed chat view
    if (selectedChat) {
      return (
        <div className="p-4 sm:p-6 max-w-full mx-auto animate-fade-in">
          <div className="mb-8">
            <button
              onClick={() => setSelectedChat(null)}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
            >
              <FaArrowLeft /> Back to AI Chats
            </button>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#1A1A1A] rounded-xl border border-[#242424]">
                <FaRobot className="text-blue-500 text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedChat.title}
                </h2>
                <p className="text-gray-400">
                  {user?.fullname || user?.username} •{" "}
                  {selectedChat.messageCount} messages • Created{" "}
                  {new Date(selectedChat.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#0D0D0D] rounded-xl border border-[#242424] p-6">
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
              {selectedChat.messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* AI Avatar on the left */}
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                      <FaRobot className="text-white text-sm" />
                    </div>
                  )}

                  {/* Message bubble */}
                  <div
                    className={`max-w-[75%] ${
                      message.role === "user"
                        ? "bg-red-600 text-white rounded-2xl rounded-tr-sm"
                        : "bg-[#1A1A1A] text-gray-200 rounded-2xl rounded-tl-sm border border-[#2A2A2A]"
                    } px-4 py-3`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-medium ${
                          message.role === "user"
                            ? "text-red-100"
                            : "text-gray-400"
                        }`}
                      >
                        {message.role === "user"
                          ? user?.username || "User"
                          : "AI Assistant"}
                      </span>
                      <span
                        className={`text-xs ${
                          message.role === "user"
                            ? "text-red-200"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {message.role === "user" ? (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    ) : (
                      <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none break-words [&_*]:break-words [&_p]:break-words [&_li]:break-words">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            h1: ({ node, ...props }) => (
                              <h1
                                className="text-base sm:text-lg font-bold mt-3 sm:mt-4 mb-2 text-white break-words"
                                {...props}
                              />
                            ),
                            h2: ({ node, ...props }) => (
                              <h2
                                className="text-sm sm:text-base font-bold mt-2 sm:mt-3 mb-2 text-white break-words"
                                {...props}
                              />
                            ),
                            h3: ({ node, ...props }) => (
                              <h3
                                className="text-sm font-semibold mt-2 sm:mt-3 mb-1.5 text-white break-words"
                                {...props}
                              />
                            ),
                            p: ({ node, ...props }) => (
                              <p
                                className="mb-2 last:mb-0 text-gray-200 break-words"
                                {...props}
                              />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul
                                className="list-disc list-outside mb-2 space-y-1 text-gray-200 ml-3 sm:ml-4 pl-2 break-words"
                                {...props}
                              />
                            ),
                            ol: ({ node, ...props }) => (
                              <ol
                                className="list-decimal list-outside mb-2 space-y-1 text-gray-200 ml-3 sm:ml-4 pl-2 break-words"
                                {...props}
                              />
                            ),
                            li: ({ node, ...props }) => (
                              <li
                                className="text-gray-200 pl-1 leading-relaxed break-words"
                                {...props}
                              />
                            ),
                            code: ({
                              node,
                              inline,
                              className,
                              children,
                              ...props
                            }: any) => {
                              const match = /language-(\w+)/.exec(
                                className || ""
                              );
                              return !inline && match ? (
                                <pre className="bg-[#0A0A0A] border border-white/10 rounded-md my-2 overflow-x-auto">
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                </pre>
                              ) : (
                                <code
                                  className="bg-[#0A0A0A] border border-white/10 rounded px-1.5 py-0.5 text-xs text-[#DE0500] font-mono break-words"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },
                            blockquote: ({ node, ...props }) => (
                              <blockquote
                                className="border-l-4 border-white/20 pl-3 sm:pl-4 my-2 italic text-gray-400 break-words"
                                {...props}
                              />
                            ),
                            a: ({ node, ...props }) => (
                              <a
                                className="text-[#DE0500] hover:text-[#FF3B3B] underline break-words"
                                target="_blank"
                                rel="noopener noreferrer"
                                {...props}
                              />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong
                                className="font-semibold text-white break-words"
                                {...props}
                              />
                            ),
                            em: ({ node, ...props }) => (
                              <em
                                className="italic text-gray-300 break-words"
                                {...props}
                              />
                            ),
                            hr: ({ node, ...props }) => (
                              <hr className="border-white/10 my-4" {...props} />
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {/* User Avatar on the right */}
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
                      <FaUser className="text-white text-sm" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    const getHistoryContent = () => {
      if (contentLoading) {
        return (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner />
          </div>
        );
      }

      switch (viewingContent) {
        case "AI Chats":
          if (contentData.aiChats.length === 0) {
            return (
              <div className="text-gray-400 text-center py-8">
                No AI chats found
              </div>
            );
          }
          return (
            <div className="space-y-4">
              {contentData.aiChats.map((chat) => (
                <div
                  key={chat._id}
                  className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424] hover:border-[#444] transition-colors cursor-pointer"
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-white font-semibold text-lg">
                      {chat.title}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {new Date(chat.lastMessageAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Show last message preview */}
                  {chat.messages.length > 0 && (
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                      {chat.messages[chat.messages.length - 1]?.content ||
                        "No messages"}
                    </p>
                  )}

                  <div className="flex items-center gap-6 text-sm text-gray-500 border-t border-[#242424] pt-4">
                    <span className="flex items-center gap-2">
                      <FaRobot className="text-blue-500" /> AI Chat
                    </span>
                    <span>{chat.messageCount} messages</span>
                    <span className="text-xs">
                      Created: {new Date(chat.createdAt).toLocaleDateString()}
                    </span>
                    <button className="ml-auto text-blue-400 hover:text-blue-300 flex items-center gap-1">
                      View Full Chat <FaArrowLeft className="rotate-180" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          );
        case "Social Posts":
          if (contentData.socialPosts.length === 0) {
            return (
              <div className="text-gray-400 text-center py-8">
                No social posts found
              </div>
            );
          }
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentData.socialPosts.map((post) => {
                const imageSrc = post.image?.buffer
                  ? `data:${post.image.mimetype || "image/jpeg"};base64,${
                      post.image.buffer
                    }`
                  : null;

                // Get primary platform for card styling
                const primaryPlatform =
                  post.platforms[0]?.toLowerCase() || "facebook";
                const platformInfo =
                  PLATFORM_META[primaryPlatform] || PLATFORM_META.facebook;
                const PlatformIcon = platformInfo.icon;

                return (
                  <div
                    key={post._id}
                    className="bg-[#1A1A1A] rounded-xl border border-[#242424] hover:border-[#444] transition-colors cursor-pointer overflow-hidden flex flex-col"
                    onClick={() => setSelectedPost(post)}
                  >
                    {imageSrc && (
                      <div className="w-full h-48 overflow-hidden bg-black/50 relative">
                        <img
                          src={imageSrc}
                          alt="Post image"
                          className="w-full h-full object-cover"
                        />
                        {/* Platform badge on image */}
                        <div className="absolute top-2 right-2 flex gap-1">
                          {post.platforms.slice(0, 3).map((platform) => {
                            const meta =
                              PLATFORM_META[platform.toLowerCase()] ||
                              PLATFORM_META.facebook;
                            const Icon = meta.icon;
                            return (
                              <div
                                key={platform}
                                className={`w-7 h-7 rounded-full flex items-center justify-center ${meta.bgClass} backdrop-blur-sm border border-white/10`}
                                style={{ backgroundColor: `${meta.color}15` }}
                              >
                                <Icon size={14} style={{ color: meta.color }} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${platformInfo.bgClass}`}
                            style={{
                              backgroundColor: `${platformInfo.color}20`,
                            }}
                          >
                            <PlatformIcon
                              className="text-sm"
                              style={{ color: platformInfo.color }}
                            />
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {post.platforms.map((platform, idx) => {
                              const meta =
                                PLATFORM_META[platform.toLowerCase()] ||
                                PLATFORM_META.facebook;
                              return (
                                <React.Fragment key={platform}>
                                  {idx > 0 && (
                                    <span className="text-gray-500 text-xs">
                                      ,
                                    </span>
                                  )}
                                  <span
                                    className="text-xs font-medium"
                                    style={{ color: meta.color }}
                                  >
                                    {meta.name}
                                  </span>
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            post.status === "published"
                              ? "bg-green-500/20 text-green-400"
                              : post.status === "scheduled"
                              ? "bg-blue-500/20 text-blue-400"
                              : post.status === "failed"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {post.status.charAt(0).toUpperCase() +
                            post.status.slice(1)}
                        </span>
                      </div>

                      <p className="text-gray-300 text-sm mb-3 line-clamp-3 flex-1">
                        {post.caption}
                      </p>

                      {post.accounts &&
                        Array.isArray(post.accounts) &&
                        post.accounts.length > 0 && (
                          <div className="flex gap-1 mb-3 flex-wrap">
                            {post.accounts.slice(0, 2).map((account, idx) => {
                              if (
                                !account ||
                                typeof account !== "object" ||
                                !account.platform
                              ) {
                                return null;
                              }
                              const meta =
                                PLATFORM_META[account.platform.toLowerCase()] ||
                                PLATFORM_META.facebook;
                              const Icon = meta.icon;

                              // Use name if available, otherwise use platform name
                              // Don't show username if it looks like an ID (all digits)
                              let displayName = account.name;
                              if (!displayName) {
                                const username = account.username || "";
                                // Check if username is just a numeric ID
                                if (username && !/^\d+$/.test(username)) {
                                  displayName = username;
                                } else {
                                  displayName = meta.name + " Account";
                                }
                              }

                              return (
                                <span
                                  key={idx}
                                  className="px-2 py-1 text-xs rounded flex items-center gap-1"
                                  style={{
                                    backgroundColor: `${meta.color}15`,
                                    color: meta.color,
                                    border: `1px solid ${meta.color}30`,
                                  }}
                                >
                                  <Icon size={10} />
                                  {displayName}
                                </span>
                              );
                            })}
                            {post.accounts.length > 2 && (
                              <span className="px-2 py-1 bg-[#2A2A2A] text-gray-400 text-xs rounded">
                                +{post.accounts.length - 2}
                              </span>
                            )}
                          </div>
                        )}

                      <div className="flex items-center justify-between text-xs text-gray-500 border-t border-[#242424] pt-3 mt-auto">
                        <span>
                          {new Date(post.scheduledAt).toLocaleDateString()}
                        </span>
                        <button className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                          View <FaArrowLeft className="rotate-180 text-xs" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        case "Websites":
          if (contentData.websites.length === 0) {
            return (
              <div className="text-gray-400 text-center py-8">
                No websites found
              </div>
            );
          }
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contentData.websites.map((website) => (
                <div
                  key={website._id}
                  className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-[#2A2A2A] rounded-lg flex items-center justify-center text-gray-500">
                      <FaGlobe className="text-2xl" />
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        website.status === 1
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {website.status === 1 ? "Active" : "Draft"}
                    </span>
                  </div>
                  <h4 className="text-white font-bold text-lg mb-1">
                    {website.websiteTitle}
                  </h4>
                  {website.websiteDescription && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {website.websiteDescription}
                    </p>
                  )}
                  {website.publishedLink && (
                    <a
                      href={`${WEB_BUILDER_SERVICE_URL}${website.publishedLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 text-sm hover:underline flex items-center gap-1 mb-4"
                    >
                      {`${WEB_BUILDER_SERVICE_URL}${website.publishedLink}`.substring(
                        0,
                        50
                      )}
                      {`${WEB_BUILDER_SERVICE_URL}${website.publishedLink}`
                        .length > 50
                        ? "..."
                        : ""}
                      <FaExternalLinkAlt className="text-xs" />
                    </a>
                  )}
                  <div className="mt-auto pt-4 border-t border-[#242424] flex justify-between text-sm text-gray-500">
                    <span>
                      Updated:{" "}
                      {new Date(website.updatedAt).toLocaleDateString()}
                    </span>
                    <span>
                      Created:{" "}
                      {new Date(website.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          );
        case "Generated Images":
          return (
            <div className="text-gray-400 text-center py-8">
              Image generation history is not available yet
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

          {/* User Profile Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-[#1A1A1A] p-6 rounded-xl border border-[#242424] mb-6">
            <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-3xl text-white font-bold">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user?.username.charAt(0).toUpperCase()
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">
                {user?.fullname || user?.username}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <FaEnvelope /> {user?.email}
                </span>
                <span className="flex items-center gap-1">
                  <FaUser /> {user?.role}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    user?.status === 1
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {user?.status === 1 ? "Active" : "Inactive"}
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
              <h2 className="text-2xl font-bold text-white">
                {viewingContent}
              </h2>
            </div>
          </div>
        </div>

        {getHistoryContent()}

        {/* Pagination */}
        {contentTotalPages > 1 && !contentLoading && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => handleContentPageChange(contentPage - 1)}
              disabled={contentPage === 1}
              className="px-4 py-2 bg-[#1A1A1A] border border-[#242424] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#444] transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-400">
              Page {contentPage} of {contentTotalPages}
            </span>
            <button
              onClick={() => handleContentPageChange(contentPage + 1)}
              disabled={contentPage === contentTotalPages}
              className="px-4 py-2 bg-[#1A1A1A] border border-[#242424] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#444] transition-colors"
            >
              Next
            </button>
          </div>
        )}
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
            {/* <div className="flex items-center justify-between p-4 bg-[#2A2A2A] rounded-lg">
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
            </div> */}
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
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setViewingContent(null);
                    setSelectedChat(null);
                    setSelectedPost(null);
                  }}
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
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setSelectedPost(null)}
          />

          <div className="relative w-full max-w-5xl max-h-[90vh] sm:max-h-[85vh] mx-auto bg-[#101014] border border-[#2c2c34] shadow-2xl rounded-xl overflow-hidden text-white transform transition-all duration-300">
            <div className="flex items-center justify-between p-4 border-b border-[#2c2c34]">
              <h2 className="text-xl font-bold tracking-wider uppercase text-gray-200">
                Post Insight
              </h2>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-[#1a1a1f]"
                aria-label="Close"
              >
                <FaTimesCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-[#2c2c34] max-h-[78vh] sm:max-h-[75vh] overflow-y-auto lg:overflow-hidden">
              <div className="lg:col-span-3 p-3 space-y-3">
                <h3 className="text-lg font-semibold text-gray-200">
                  Post Content
                </h3>

                <div className="p-2 space-y-4">
                  {selectedPost.image?.buffer ? (
                    <div className="relative w-full rounded-md overflow-hidden bg-black/40 flex items-center justify-center border-2 border-dotted border-gray-600">
                      <img
                        src={`data:${
                          selectedPost.image.mimetype || "image/jpeg"
                        };base64,${selectedPost.image.buffer}`}
                        alt={
                          selectedPost.caption
                            ? selectedPost.caption.slice(0, 60)
                            : "Post media"
                        }
                        className="w-full max-h-72 object-contain"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-black/50 flex items-center justify-center rounded-md border-2 border-dotted border-gray-600">
                      <span className="text-gray-500 text-sm">
                        No visual media attached
                      </span>
                    </div>
                  )}

                  <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap break-words min-h-[40px] max-h-40 md:max-h-56 overflow-y-auto pr-1 pt-2">
                    {selectedPost.caption || (
                      <span className="text-gray-500 italic">
                        No caption added.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 p-6 space-y-4">
                <div className="space-y-4 border-b border-gray-700/50 pb-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold text-xs ring-1 transition-all ${
                        selectedPost.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30"
                          : selectedPost.status === "scheduled"
                          ? "bg-cyan-500/10 text-cyan-400 ring-cyan-500/30"
                          : selectedPost.status === "failed"
                          ? "bg-rose-500/10 text-rose-400 ring-rose-500/30"
                          : "bg-gray-500/10 text-gray-400 ring-gray-500/30"
                      }`}
                    >
                      {selectedPost.status === "published" && (
                        <FaCheckCircle className="w-3 h-3" />
                      )}
                      {selectedPost.status === "scheduled" && (
                        <FaClock className="w-3 h-3" />
                      )}
                      {selectedPost.status === "failed" && (
                        <FaTimesCircle className="w-3 h-3" />
                      )}
                      {selectedPost.status === "cancelled" && (
                        <FaBell className="w-3 h-3" />
                      )}
                      <span className="uppercase tracking-widest">
                        {selectedPost.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm font-light text-gray-300 flex items-center gap-2">
                    <FaCog className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-gray-400">
                      {selectedPost.status === "scheduled"
                        ? "Scheduled at:"
                        : "Published at:"}
                    </span>
                    <span className="font-semibold text-white">
                      {new Date(
                        selectedPost.publishedAt || selectedPost.scheduledAt
                      ).toLocaleDateString()}{" "}
                      at{" "}
                      {new Date(
                        selectedPost.publishedAt || selectedPost.scheduledAt
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div className="border-b border-gray-700/50 pb-4">
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">
                    Target Platforms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.platforms?.map((p) => {
                      const platformMeta =
                        PLATFORM_META[p.toLowerCase()] ||
                        PLATFORM_META.facebook;
                      const PlatformIcon = platformMeta.icon;
                      return (
                        <div
                          key={p}
                          className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1f] rounded-full border"
                          style={{
                            borderColor: `${platformMeta.color}30`,
                            backgroundColor: `${platformMeta.color}10`,
                          }}
                        >
                          <PlatformIcon
                            size={14}
                            style={{ color: platformMeta.color }}
                          />
                          <span
                            className="text-xs font-medium uppercase tracking-wider"
                            style={{ color: platformMeta.color }}
                          >
                            {platformMeta.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedPost.accounts &&
                  Array.isArray(selectedPost.accounts) &&
                  selectedPost.accounts.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-200 mb-3">
                        Accounts
                      </h3>
                      <div className="space-y-3">
                        {selectedPost.accounts.map((acc, idx) => {
                          const initials = (
                            acc.name ||
                            acc.username ||
                            acc.platform ||
                            "?"
                          )
                            .trim()
                            .charAt(0)
                            .toUpperCase();
                          return (
                            <div
                              key={`${acc.platform}-${idx}`}
                              className="flex items-center justify-between bg-[#1a1a1f] border border-[#2c2c34] rounded-lg p-3"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="flex items-center justify-center w-9 h-9 rounded-full border border-[#2c2c34] overflow-hidden bg-[#0f0f13] flex-shrink-0">
                                  {acc.profileImage ? (
                                    <img
                                      src={acc.profileImage}
                                      alt={
                                        acc.username || acc.name || "Account"
                                      }
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-gray-300 text-sm font-semibold">
                                      {initials}
                                    </span>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-white text-sm truncate">
                                    {acc.name ||
                                      acc.username ||
                                      "Unknown account"}
                                  </div>
                                  <div className="text-gray-400 text-xs truncate">
                                    {acc.username
                                      ? `@${acc.username.replace(/^@/, "")}`
                                      : acc.platform}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaShareAlt
                                  size={14}
                                  className="text-blue-400"
                                />
                                <span className="text-gray-400 text-xs uppercase tracking-wider">
                                  {acc.platform}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UserDetailsPage;
