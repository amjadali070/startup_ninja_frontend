import React from "react";
import { FaRobot, FaShareAlt, FaGlobe, FaImage } from "react-icons/fa";
import type { ExtendedUserDetails } from "../../../types/admin";

interface ContentTabProps {
  user: ExtendedUserDetails;
  handleViewContent: (type: string) => void;
}

const ContentTab: React.FC<ContentTabProps> = ({ user, handleViewContent }) => {
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
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => handleViewContent("Websites")}
            className="text-blue-400 text-sm hover:underline"
          >
            View Sites
          </button>
          {/* <span className="text-gray-600">|</span> */}
          {/* <button
            onClick={() => handleViewContent("Website Analytics")}
            className="text-green-400 text-sm hover:underline"
          >
            Analytics
          </button> */}
        </div>
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

export default ContentTab;
