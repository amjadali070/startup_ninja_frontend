import React from "react";
import { FaGlobe, FaExternalLinkAlt } from "react-icons/fa";
import type { Website } from "../../../types/admin";

interface WebsitesListViewProps {
  websites: Website[];
  WEB_BUILDER_SERVICE_URL: string;
  onSelectWebsite?: (websiteId: string) => void;
}

const WebsitesListView: React.FC<WebsitesListViewProps> = ({
  websites,
  WEB_BUILDER_SERVICE_URL,
  onSelectWebsite,
}) => {
  if (websites.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8">No websites found</div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {websites.map((website) => (
        <div
          key={website._id}
          className="bg-[#1A1A1A] p-4 sm:p-6 rounded-xl border border-[#242424] flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2A2A2A] rounded-lg flex items-center justify-center text-gray-500">
              <FaGlobe className="text-xl sm:text-2xl" />
            </div>
            <span
              className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                website.status === 1
                  ? "bg-green-500/20 text-green-400"
                  : "bg-gray-500/20 text-gray-400"
              }`}
            >
              {website.status === 1 ? "Active" : "Draft"}
            </span>
          </div>
          <h4 className="text-white font-bold text-base sm:text-lg mb-1 break-words">
            {website.websiteTitle}
          </h4>
          {website.websiteDescription && (
            <p className="text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2">
              {website.websiteDescription}
            </p>
          )}
          {website.publishedLink && (
            <a
              href={`${WEB_BUILDER_SERVICE_URL}${website.publishedLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-xs sm:text-sm hover:underline flex items-center gap-1 mb-4 min-w-0 group"
            >
              <span className="truncate break-all">
                {`${WEB_BUILDER_SERVICE_URL}${website.publishedLink}`.substring(
                  0,
                  50
                )}
                {`${WEB_BUILDER_SERVICE_URL}${website.publishedLink}`.length > 50
                  ? "..."
                  : ""}
              </span>
              <FaExternalLinkAlt className="text-xs flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </a>
          )}
          <div className="mt-auto pt-4 border-t border-[#242424] flex flex-col sm:flex-row sm:justify-between gap-2 text-xs sm:text-sm text-gray-500">
            <span className="truncate">
              Updated: {new Date(website.updatedAt).toLocaleDateString()}
            </span>
            <span className="truncate">
              Created: {new Date(website.createdAt).toLocaleDateString()}
            </span>
          </div>
          {onSelectWebsite && (
            <button
              onClick={() => onSelectWebsite(website._id)}
              className="mt-3 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-xs sm:text-sm"
            >
              View Analytics
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default WebsitesListView;
