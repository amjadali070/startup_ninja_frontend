import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { adminService } from "../../services/admin";
import { authService } from "../../services/auth";
import { useAuth } from "../../hooks/useAuth";
import DashboardLayout from "../../layouts/DashboardLayout";
import type {
  ExtendedUserDetails,
  AIChat,
  SocialPost,
  Website,
  GeneratedImage,
  Lead,
  Project,
  Contract,
} from "../../types/admin";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import {

  PLATFORM_META,
  WEB_BUILDER_SERVICE_URL,
} from "../../utils/userDetailsConstants";
import UserProfileHeader from "../../components/admin-dashboard/user-details/UserProfileHeader";
import TabNavigation from "../../components/admin-dashboard/user-details/TabNavigation";
import OverviewTab from "../../components/admin-dashboard/user-details/OverviewTab";
import ProfileTab from "../../components/admin-dashboard/user-details/ProfileTab";
import SubscriptionTab from "../../components/admin-dashboard/user-details/SubscriptionTab";
import ContentTab from "../../components/admin-dashboard/user-details/ContentTab";
import SecurityTab from "../../components/admin-dashboard/user-details/SecurityTab";
import ManageResourcesView from "../../components/admin-dashboard/user-details/ManageResourcesView";
import EditUserView from "../../components/admin-dashboard/user-details/EditUserView";
import ContentHistoryView from "../../components/admin-dashboard/user-details/ContentHistoryView";
import PostDetailModal from "../../components/admin-dashboard/user-details/PostDetailModal";

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
    generatedImages: GeneratedImage[];
    leads: Lead[];
    projects: Project[];
    contracts: Contract[];
  }>({
    aiChats: [],
    socialPosts: [],
    websites: [],
    generatedImages: [],
    leads: [],
    projects: [],
    contracts: [],
  });
  const [contentLoading, setContentLoading] = useState(false);
  const [contentPage, setContentPage] = useState(1);
  const [contentTotalPages, setContentTotalPages] = useState(1);

  const [resourceForm, setResourceForm] = useState({
    chatTokensLimit: 0,
    imageGenLimit: 0,
    websiteLimit: 0,
    socialPostLimit: 0,
    legalContractsLimit: 0,
    contractRevisionsLimit: 0,
    salesLeadsLimit: 0,
    salesProjectsLimit: 0,
    aiPostWriterLimit: 0,
    chatBotMessagesLimit: 0,
    fbPageConnectLimit: 0,
    websiteHostingLimit: 0,
    webBuilderSessionsLimit: 0,
    singlePageWebsite: false,
    multiPageWebsite: false,
    teamMembersLimit: 0,
    addOnCharge: 0,
    features: [] as string[],
    activeFeatureList: {
      ai_chat: 1,
      ai_image_gen: 1,
      web_builder: 1,
      social_pro: 1,
      ninja_legal: 1,
      ninja_sales: 1,
    } as Record<string, number>,
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

  useEffect(() => {
    if (viewingContent && userId && user) {
      fetchContentData(viewingContent, contentPage);
    }
  }, [viewingContent, userId, user]);

  const fetchUser = React.useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const response = await adminService.getUserById(userId);

      if (response.success && response.data) {



        // Fetch actual content counts
        const [aiChatsRes, socialPostsRes, websitesRes, generatedImagesRes, contractsRes] = await Promise.all([
          adminService.getUserAIChats(userId, { page: 1, limit: 1 }),
          adminService.getUserSocialPosts(userId, { page: 1, limit: 1 }),
          adminService.getUserWebsites(userId, { page: 1, limit: 1 }),
          adminService.getUserGeneratedImages(userId, { page: 1, limit: 1 }),
          adminService.getUserContracts(userId, { page: 1, limit: 1 }),
        ]);

        const totalChats =
          aiChatsRes.success && aiChatsRes.data?.pagination?.total
            ? aiChatsRes.data.pagination.total
            : response.data.contentStats.totalChats || 0;

        const totalPosts =
          socialPostsRes.success && socialPostsRes.data?.pagination?.total
            ? socialPostsRes.data.pagination.total
            : response.data.contentStats.totalPosts || 0;

        const totalWebsites =
          websitesRes.success && websitesRes.data?.pagination?.total
            ? websitesRes.data.pagination.total
            : response.data.contentStats.totalWebsites || 0;

        const totalImages =
          generatedImagesRes.success && generatedImagesRes.data?.pagination?.total
            ? generatedImagesRes.data.pagination.total
            : response.data.contentStats.totalImages || 0;

        const totalContracts =
          contractsRes.success && contractsRes.data?.pagination?.total
            ? contractsRes.data.pagination.total
            : response.data.contentStats.totalContracts || 0;

        const extendedUser: ExtendedUserDetails = {
          ...response.data.user,
          subscription: response.data.subscription || {
            plan: 'Free',
            status: 'active',
            startDate: new Date().toISOString(),
            nextBillingDate: new Date().toISOString(),
            amount: 0,
            interval: 'month'
          },
          usage: response.data.usage || {
            chatTokensUsed: 0,
            chatTokensLimit: 0,
            imageGenUsed: 0,
            imageGenLimit: 0,
            websiteUsed: 0,
            websiteLimit: 0,
            socialPostsUsed: 0,
            socialPostLimit: 0,
            legalContractsUsed: 0,
            legalContractsLimit: 0,
            legalContractRevisionsUsed: 0,
            legalContractRevisionsLimit: 0,
            salesLeadsUsed: 0,
            salesLeadsLimit: 0,
            salesProjectsUsed: 0,
            salesProjectsLimit: 0,
            aiPostWriterUsed: 0,
            aiPostWriterLimit: 0,
            chatBotMessagesUsed: 0,
            chatBotMessagesLimit: 0,
            fbPageConnectUsed: 0,
            fbPageConnectLimit: 0,
            websiteHostingUsed: 0,
            websiteHostingLimit: 0,
            webBuilderSessionsUsed: 0,
            webBuilderSessionsLimit: 0,
            singlePageWebsite: false,
            multiPageWebsite: false,

            periodStart: new Date().toISOString(),
            periodEnd: new Date().toISOString()
          },
          features: response.data.features || [],
          transactions: response.data.transactions || [],
          contentStats: {
            totalChats: totalChats,
            totalPosts: totalPosts,
            totalWebsites: totalWebsites,
            totalImages: totalImages,
            totalLeads: response.data.contentStats.totalLeads || 0,
            totalProjects: response.data.contentStats.totalProjects || 0,
            totalContracts: totalContracts,
          },
          activityLogs:
            response.data.activities?.map((activity) => ({
              id: activity._id,
              action: activity.activityType
                .toLowerCase()
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase()), // Format: PASSWORD_UPDATE -> Password Update
              ip: activity.ipAddress,
              userAgent: activity.device,
              timestamp: activity.createdAt,
              details: activity.details,
            })) || [],
          loginSessions: response.data.loginSessions || [],
        };
        setUser(extendedUser);

        console.log("Fetched user details:", extendedUser);

        setResourceForm({
          chatTokensLimit: extendedUser.usage.chatTokensLimit || 0,
          imageGenLimit: extendedUser.usage.imageGenLimit || 0,
          websiteLimit: extendedUser.usage.websiteLimit || extendedUser.subscription?.limits?.websites || extendedUser.subscription?.limits?.website_creation || 0,
          socialPostLimit: extendedUser.usage.socialPostLimit || extendedUser.subscription?.limits?.social_posts || 0,
          legalContractsLimit: extendedUser.usage.legalContractsLimit || extendedUser.subscription?.limits?.legal_contracts || 0,
          contractRevisionsLimit: extendedUser.usage.legalContractRevisionsLimit || extendedUser.subscription?.limits?.legal_contract_section_revisions || 0,
          salesLeadsLimit: extendedUser.usage.salesLeadsLimit || extendedUser.subscription?.limits?.sales_leads || 0,
          salesProjectsLimit: extendedUser.usage.salesProjectsLimit || extendedUser.subscription?.limits?.sales_projects || 0,
          teamMembersLimit: extendedUser.usage?.teamMembersLimit || 0,


          // Configure new fields
          aiPostWriterLimit: extendedUser.usage?.aiPostWriterLimit || 0,
          chatBotMessagesLimit: extendedUser.usage?.chatBotMessagesLimit || 0,
          fbPageConnectLimit: extendedUser.usage?.fbPageConnectLimit || 0,
          websiteHostingLimit: extendedUser.usage?.websiteHostingLimit || 0,
          webBuilderSessionsLimit: extendedUser.usage?.webBuilderSessionsLimit || 0,
          singlePageWebsite: extendedUser.usage?.singlePageWebsite || false,
          multiPageWebsite: extendedUser.usage?.multiPageWebsite || false,
          features: extendedUser.features,
          activeFeatureList: (extendedUser.subscription?.activeFeatureList as Record<string, number>) || {
            ai_chat: 1,
            ai_image_gen: 1,
            web_builder: 1,
            social_pro: 1,
            ninja_legal: 1,
            ninja_sales: 1,
          },
          addOnCharge: 0,
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
  }, [userId, navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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
      } else if (type === "Generated Images") {
        const response = await adminService.getUserGeneratedImages(userId, {
          page,
          limit: 32,
        });
        if (response.success && response.data) {
          setContentData((prev) => ({
            ...prev,
            generatedImages: response.data?.data || [],
          }));
          setContentTotalPages(response.data.pagination.pages);
        }
      } else if (type === "Sales Leads") {
        const response = await adminService.getUserLeads(userId, {
          page,
          limit: 20,
        });
        if (response.success && response.data) {
          setContentData((prev) => ({ ...prev, leads: response.data!.data }));
          setContentTotalPages(response.data.pagination.pages);
        }
      } else if (type === "Sales Projects") {
        const response = await adminService.getUserProjects(userId, {
          page,
          limit: 20,
        });
        if (response.success && response.data) {
          setContentData((prev) => ({ ...prev, projects: response.data!.data }));
          setContentTotalPages(response.data.pagination.pages);
        }
      } else if (type === "AI Contracts") {
        const response = await adminService.getUserContracts(userId, {
          page,
          limit: 20,
        });
        if (response.success && response.data) {
          setContentData((prev) => ({ ...prev, contracts: response.data!.data }));
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
    try {
      const limitsPayload = {
        ai_chat_messages: resourceForm.chatTokensLimit,
        generated_images: resourceForm.imageGenLimit,
        website_creation: resourceForm.websiteLimit,
        social_posts: resourceForm.socialPostLimit,
        legal_contracts: resourceForm.legalContractsLimit,
        legal_contract_section_revisions: resourceForm.contractRevisionsLimit,
        sales_leads: resourceForm.salesLeadsLimit,
        sales_projects: resourceForm.salesProjectsLimit,
        ai_post_writer: resourceForm.aiPostWriterLimit,
        chat_bot_messages: resourceForm.chatBotMessagesLimit,
        facebook_page_connect: resourceForm.fbPageConnectLimit,
        website_hosting: resourceForm.websiteHostingLimit,
        web_builder_sessions: resourceForm.webBuilderSessionsLimit,
        single_page_website: resourceForm.singlePageWebsite,
        multi_page_website: resourceForm.multiPageWebsite,
        team_members: resourceForm.teamMembersLimit,
      };

      // if (resourceForm.addOnCharge > 0) {
        const payload = {
          userId: user._id,
          price: resourceForm.addOnCharge,
          limits: limitsPayload,
          activeFeatureList: resourceForm.activeFeatureList,
        };
        const response = await adminService.createCustomProposal(payload);
        if (response.success) {
          toast.success("Custom Payment Link generated & emailed to user!");
          setViewingResources(false);
          fetchUser();
        } else {
          toast.error(response.message || "Failed to create proposal");
        }
      // }
      //  else {
      //   const payload = {
      //     limits: limitsPayload,
      //     addOnCharge: 0,
      //     activeFeatureList: resourceForm.activeFeatureList,
      //   };
      //   const response = await adminService.updateUserResources(user._id, payload);
      //   if (response.success) {
      //     toast.success("User resources updated successfully");
      //     setViewingResources(false);
      //     fetchUser();
      //   } else {
      //     console.log("Update failed response:", response);
      //     toast.error(response.message || "Failed to update resources.");
      //   }
      // }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while updating resources.");
    }
  };

  const handleUpdateUser = async () => {
    if (!user) return;

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
    setResourceForm((prev:any) => {
      const current = (prev.activeFeatureList && typeof prev.activeFeatureList === 'object') ? prev.activeFeatureList : {};
      const exists = current[feature] === 1 || current[feature] === true;
      return {
        ...prev,
        activeFeatureList: {
          ...current,
          [feature]: exists ? 0 : 1,
        },
      };
    });
  };

  const handleTabChange = (
    tab: "overview" | "profile" | "subscription" | "content" | "security"
  ) => {
    setActiveTab(tab);
    setViewingContent(null);
    setSelectedChat(null);
    setSelectedPost(null);
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
        ) : viewingResources && user ? (
          <ManageResourcesView
            user={user}
            resourceForm={resourceForm}
            setResourceForm={setResourceForm}
            setViewingResources={setViewingResources}
            handleUpdateResources={handleUpdateResources}
            toggleFeature={toggleFeature}
          />
        ) : viewingEditUser && user ? (
          <EditUserView
            user={user}
            editForm={editForm}
            setEditForm={setEditForm}
            setViewingEditUser={setViewingEditUser}
            handleUpdateUser={handleUpdateUser}
          />
        ) : viewingContent && user ? (
          <ContentHistoryView
            user={user}
            viewingContent={viewingContent}
            contentData={contentData}
            contentLoading={contentLoading}
            contentPage={contentPage}
            contentTotalPages={contentTotalPages}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            handleContentPageChange={handleContentPageChange}
            closeContentHistory={closeContentHistory}
            setViewingResources={setViewingResources}
            setViewingEditUser={setViewingEditUser}
            PLATFORM_META={PLATFORM_META}
            WEB_BUILDER_SERVICE_URL={WEB_BUILDER_SERVICE_URL}
          />
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

              <UserProfileHeader
                user={user}
                onManageResources={() => setViewingResources(true)}
                onEditUser={() => setViewingEditUser(true)}
              />
            </div>

            {/* Tabs */}
            <TabNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === "overview" && (
                <OverviewTab user={user} formatDate={formatDate} />
              )}
              {activeTab === "profile" && (
                <ProfileTab user={user} formatDate={formatDate} />
              )}
              {activeTab === "subscription" && <SubscriptionTab user={user} />}
              {activeTab === "content" && (
                <ContentTab user={user} handleViewContent={handleViewContent} />
              )}
              {activeTab === "security" && (
                <SecurityTab
                  user={user}
                  formatDate={formatDate}
                  onUpdate={fetchUser}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
          PLATFORM_META={PLATFORM_META}
        />
      )}
    </DashboardLayout>
  );
};

export default UserDetailsPage;


