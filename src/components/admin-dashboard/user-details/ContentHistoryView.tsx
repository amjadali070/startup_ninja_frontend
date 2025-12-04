import React from "react";
import {
  FaArrowLeft,
  FaEnvelope,
  FaUser,
  FaTools,
  FaRobot,
  FaShareAlt,
  FaGlobe,
  FaImage,
  FaChartBar,
} from "react-icons/fa";
import LoadingSpinner from "../../LoadingSpinner";
import ChatDetailView from "./ChatDetailView";
import AIChatsListView from "./AIChatsListView";
import SocialPostsListView from "./SocialPostsListView";
import WebsitesListView from "./WebsitesListView";
import WebsiteAnalyticsView from "./WebsiteAnalyticsView";
import SingleWebsiteAnalyticsView from "./SingleWebsiteAnalyticsView";
import type {
  ExtendedUserDetails,
  AIChat,
  SocialPost,
  Website,
} from "../../../types/admin";

interface ContentHistoryViewProps {
  viewingContent: string | null;
  user: ExtendedUserDetails;
  selectedChat: AIChat | null;
  setSelectedChat: (chat: AIChat | null) => void;
  contentLoading: boolean;
  contentData: {
    aiChats: AIChat[];
    socialPosts: SocialPost[];
    websites: Website[];
  };
  contentPage: number;
  contentTotalPages: number;
  handleContentPageChange: (page: number) => void;
  closeContentHistory: () => void;
  setViewingResources: (viewing: boolean) => void;
  setViewingEditUser: (viewing: boolean) => void;
  PLATFORM_META: Record<
    string,
    { icon: React.ElementType; color: string; name: string; bgClass: string }
  >;
  WEB_BUILDER_SERVICE_URL: string;
}

const ContentHistoryView: React.FC<ContentHistoryViewProps> = ({
  viewingContent,
  user,
  selectedChat,
  setSelectedChat,
  contentLoading,
  contentData,
  contentPage,
  contentTotalPages,
  handleContentPageChange,
  closeContentHistory,
  setViewingResources,
  setViewingEditUser,
  PLATFORM_META,
  WEB_BUILDER_SERVICE_URL,
}) => {
  const [selectedWebsiteId, setSelectedWebsiteId] = React.useState<string | null>(null);

  if (!viewingContent) return null;

  // Render single website analytics view
  if (selectedWebsiteId) {
    return (
      <div className="p-4 sm:p-6 max-w-full mx-auto animate-fade-in">
        <SingleWebsiteAnalyticsView
          websiteId={selectedWebsiteId}
          onBack={() => setSelectedWebsiteId(null)}
          WEB_BUILDER_SERVICE_URL={WEB_BUILDER_SERVICE_URL}
        />
      </div>
    );
  }

  // Render detailed chat view
  if (selectedChat) {
    return (
      <ChatDetailView
        selectedChat={selectedChat}
        user={user}
        setSelectedChat={setSelectedChat}
      />
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
        return (
          <AIChatsListView
            aiChats={contentData.aiChats}
            setSelectedChat={setSelectedChat}
          />
        );
      case "Social Posts":
        return (
          <SocialPostsListView
            socialPosts={contentData.socialPosts}
            setSelectedPost={() => {}} // This will be passed from parent
            PLATFORM_META={PLATFORM_META}
          />
        );
      case "Websites":
        return (
          <WebsitesListView
            websites={contentData.websites}
            WEB_BUILDER_SERVICE_URL={WEB_BUILDER_SERVICE_URL}
            onSelectWebsite={setSelectedWebsiteId}
          />
        );
      case "Website Analytics":
        return <WebsiteAnalyticsView userId={user._id} />;
      case "Generated Images":
        return (
          <div className="text-gray-400 text-center py-8">
            Image generation history is not available yet
          </div>
        );
      default:
        return (
          <div className="text-gray-400 text-center py-8">No content found</div>
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
            {viewingContent === "Website Analytics" && (
              <FaChartBar className="text-green-500 text-2xl" />
            )}
            {viewingContent === "Generated Images" && (
              <FaImage className="text-purple-500 text-2xl" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{viewingContent}</h2>
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

export default ContentHistoryView;
