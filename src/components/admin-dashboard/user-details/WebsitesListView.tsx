import React from "react";
import { FaGlobe, FaExternalLinkAlt } from "react-icons/fa";
import type { Website } from "../../../types/admin";

interface WebsitesListViewProps {
  websites: Website[];
  WEB_BUILDER_SERVICE_URL: string;
}

const WebsitesListView: React.FC<WebsitesListViewProps> = ({
  websites,
  WEB_BUILDER_SERVICE_URL,
}) => {
  if (websites.length === 0) {
    return (
      <div className="text-gray-400 text-center py-8">No websites found</div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {websites.map((website) => (
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
              {`${WEB_BUILDER_SERVICE_URL}${website.publishedLink}`.length > 50
                ? "..."
                : ""}
              <FaExternalLinkAlt className="text-xs" />
            </a>
          )}
          <div className="mt-auto pt-4 border-t border-[#242424] flex justify-between text-sm text-gray-500">
            <span>
              Updated: {new Date(website.updatedAt).toLocaleDateString()}
            </span>
            <span>
              Created: {new Date(website.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WebsitesListView;
