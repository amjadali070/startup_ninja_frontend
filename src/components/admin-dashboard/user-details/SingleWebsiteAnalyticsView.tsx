import React, { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaDatabase,
  FaFileAlt,
  FaImage,
  FaGlobe,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { adminService } from "../../../services/admin";
import type { SingleWebsiteAnalytics } from "../../../types/admin";

interface SingleWebsiteAnalyticsViewProps {
  websiteId: string;
  onBack: () => void;
  WEB_BUILDER_SERVICE_URL: string;
}

const SingleWebsiteAnalyticsView: React.FC<
  SingleWebsiteAnalyticsViewProps
> = ({ websiteId, onBack, WEB_BUILDER_SERVICE_URL }) => {
  const [analytics, setAnalytics] = useState<SingleWebsiteAnalytics | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [websiteId]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getSingleWebsiteAnalytics(websiteId);
      if (response.success && response.data) {
        setAnalytics(response.data);
      } else {
        setError(response.message || "Failed to fetch analytics");
      }
    } catch (err) {
      setError("An error occurred while fetching analytics");
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analytics || !analytics.websiteInfo) {
    return (
      <div className="text-gray-400 text-center py-8">
        No analytics data available
      </div>
    );
  }

  const { websiteInfo, storage, assets, pages } = analytics;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <FaArrowLeft /> Back to Websites
      </button>

      {/* Website Header */}
      <div className="bg-[#1A1A1A] p-4 sm:p-6 rounded-xl border border-[#242424]">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white break-words">
                {websiteInfo.title}
              </h1>
              <span
                className={`px-2 sm:px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                  websiteInfo.status === "published"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {websiteInfo.status}
              </span>
            </div>
            {websiteInfo.description && (
              <p className="text-gray-400 mb-3 text-sm sm:text-base break-words">{websiteInfo.description}</p>
            )}
            {websiteInfo.publishedLink && (
              <a
                href={`${WEB_BUILDER_SERVICE_URL}${websiteInfo.publishedLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline flex items-center gap-2 text-xs sm:text-sm break-all"
              >
                <span className="truncate max-w-full sm:max-w-md">
                  {`${WEB_BUILDER_SERVICE_URL}${websiteInfo.publishedLink}`.substring(
                    0,
                    60
                  )}
                  ...
                </span>
                <FaExternalLinkAlt className="text-xs flex-shrink-0" />
              </a>
            )}
          </div>
          <div className="text-left lg:text-right text-xs sm:text-sm text-gray-500 space-y-1">
            <p>Created: {new Date(websiteInfo.createdAt).toLocaleDateString()}</p>
            <p>Updated: {new Date(websiteInfo.updatedAt).toLocaleDateString()}</p>
            {websiteInfo.publishedAt && (
              <>
                <p className="text-green-400 font-medium mt-1">
                  Published: {new Date(websiteInfo.publishedAt).toLocaleDateString()}
                </p>
                {websiteInfo.daysPublished !== null && websiteInfo.daysPublished !== undefined && (
                  <p className="text-blue-400 text-xs">
                    {websiteInfo.daysPublished} {websiteInfo.daysPublished === 1 ? 'day' : 'days'} live
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-[#1A1A1A] p-4 sm:p-6 rounded-xl border border-[#242424]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaDatabase className="text-purple-400" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-400 text-xs sm:text-sm">Total Storage</p>
              <p className="text-white text-xl sm:text-2xl font-bold truncate">
                {storage.totalMB} MB
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-4 sm:p-6 rounded-xl border border-[#242424]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaFileAlt className="text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-400 text-xs sm:text-sm">Total Assets</p>
              <p className="text-white text-xl sm:text-2xl font-bold truncate">
                {assets.totalCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-4 sm:p-6 rounded-xl border border-[#242424] sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaGlobe className="text-green-400" />
            </div>
            <div className="min-w-0">
              <p className="text-gray-400 text-xs sm:text-sm">Pages</p>
              <p className="text-white text-xl sm:text-2xl font-bold truncate">{pages.count}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Storage Breakdown */}
      <div className="bg-[#1A1A1A] p-4 sm:p-6 rounded-xl border border-[#242424]">
        <h3 className="text-white font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
          <FaDatabase className="text-purple-400" />
          Storage Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-[#0A0A0A] p-3 sm:p-4 rounded-lg border border-[#242424]">
            <p className="text-gray-400 text-xs sm:text-sm mb-2">Website Data</p>
            <p className="text-white text-lg sm:text-xl font-bold truncate">
              {storage.breakdown.websiteData.sizeMB} MB
            </p>
            <p className="text-gray-500 text-xs mt-1">Configuration</p>
          </div>

          <div className="bg-[#0A0A0A] p-3 sm:p-4 rounded-lg border border-[#242424]">
            <p className="text-gray-400 text-xs sm:text-sm mb-2">Documents</p>
            <p className="text-white text-lg sm:text-xl font-bold truncate">
              {storage.breakdown.documents.sizeMB} MB
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {storage.breakdown.documents.count} files
            </p>
          </div>

          <div className="bg-[#0A0A0A] p-3 sm:p-4 rounded-lg border border-[#242424]">
            <p className="text-gray-400 text-xs sm:text-sm mb-2">Gallery Assets</p>
            <p className="text-white text-lg sm:text-xl font-bold truncate">
              {storage.breakdown.galleryAssets.sizeMB} MB
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {storage.breakdown.galleryAssets.count} files
            </p>
          </div>

          <div className="bg-[#0A0A0A] p-3 sm:p-4 rounded-lg border border-[#242424]">
            <p className="text-gray-400 text-xs sm:text-sm mb-2">Preview</p>
            <p className="text-white text-lg sm:text-xl font-bold truncate">
              {storage.breakdown.preview.sizeMB} MB
            </p>
            <p className="text-gray-500 text-xs mt-1">Thumbnail</p>
          </div>
        </div>
      </div>

      {/* Recent Assets */}
      {assets.recentAssets.length > 0 && (
        <div className="bg-[#1A1A1A] p-4 sm:p-6 rounded-xl border border-[#242424]">
          <h3 className="text-white font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
            <FaImage className="text-blue-400" />
            Recent Assets
          </h3>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#242424]">
                    <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3 pr-2">
                      Name
                    </th>
                    <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3 px-2 hidden sm:table-cell">
                      Type
                    </th>
                    <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3 px-2">
                      Size
                    </th>
                    <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3 px-2 hidden md:table-cell">
                      Source
                    </th>
                    <th className="text-left text-gray-400 text-xs sm:text-sm font-medium pb-3 pl-2">
                      Uploaded
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assets.recentAssets.map((asset, index) => (
                    <tr
                      key={index}
                      className="border-b border-[#242424] hover:bg-[#0A0A0A] transition-colors"
                    >
                      <td className="py-3 text-white text-xs sm:text-sm pr-2 max-w-[150px] sm:max-w-none truncate">{asset.name}</td>
                      <td className="py-3 text-gray-400 text-xs sm:text-sm px-2 hidden sm:table-cell truncate">{asset.type}</td>
                      <td className="py-3 text-gray-400 text-xs sm:text-sm px-2 whitespace-nowrap">
                        {formatBytes(asset.size)}
                      </td>
                      <td className="py-3 px-2 hidden md:table-cell">
                        <span
                          className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                            asset.source === "document"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-purple-500/20 text-purple-400"
                          }`}
                        >
                          {asset.source}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400 text-xs sm:text-sm pl-2 whitespace-nowrap">
                        {new Date(asset.uploadedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="text-center text-gray-500 text-xs sm:text-sm">
        Last updated: {new Date(analytics.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
};

export default SingleWebsiteAnalyticsView;
