import React from "react";
import {
  FaArrowLeft,
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
import PostDetailModal from "./PostDetailModal";
import UserProfileHeader from "./UserProfileHeader";
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
  const [selectedWebsiteId, setSelectedWebsiteId] = React.useState<
    string | null
  >(null);
  const [selectedPost, setSelectedPost] = React.useState<SocialPost | null>(
    null
  );

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
            setSelectedPost={setSelectedPost}
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
      {selectedPost && (
        <PostDetailModal
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
          PLATFORM_META={PLATFORM_META}
        />
      )}
      <div className="mb-8">
        <button
          onClick={closeContentHistory}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <FaArrowLeft /> Back to User Details
        </button>

        {/* User Profile Header */}
        <UserProfileHeader
          user={user}
          onManageResources={() => setViewingResources(true)}
          onEditUser={() => setViewingEditUser(true)}
        />

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
