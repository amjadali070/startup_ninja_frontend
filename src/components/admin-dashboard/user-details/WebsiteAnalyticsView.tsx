import React, { useEffect, useState } from "react";
import {
  FaDatabase,
  FaFileAlt,
  FaImage,
  FaGlobe,
  FaChartPie,
} from "react-icons/fa";
import { adminService } from "../../../services/admin";
import type { WebsiteAnalytics } from "../../../types/admin";

interface WebsiteAnalyticsViewProps {
  userId: string;
}

const WebsiteAnalyticsView: React.FC<WebsiteAnalyticsViewProps> = ({
  userId,
}) => {
  const [analytics, setAnalytics] = useState<WebsiteAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [userId]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getUserWebsiteAnalytics(userId);
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

  if (!analytics) {
    return (
      <div className="text-gray-400 text-center py-8">
        No analytics data available
      </div>
    );
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <FaGlobe className="text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Websites</p>
              <p className="text-white text-2xl font-bold">
                {analytics.totalWebsites}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <FaGlobe className="text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Published</p>
              <p className="text-white text-2xl font-bold">
                {analytics.publishedWebsites}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <FaFileAlt className="text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Drafts</p>
              <p className="text-white text-2xl font-bold">
                {analytics.draftWebsites}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <FaDatabase className="text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Storage</p>
              <p className="text-white text-2xl font-bold">
                {analytics.totalStorageMB} MB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Storage Breakdown */}
      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <FaChartPie className="text-blue-400" />
          Storage Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#242424]">
            <div className="flex items-center gap-2 mb-2">
              <FaImage className="text-blue-400" />
              <p className="text-gray-400 text-sm">Gallery Files</p>
            </div>
            <p className="text-white text-xl font-bold">
              {analytics.storageBreakdown.galleryFiles.sizeMB} MB
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {analytics.storageBreakdown.galleryFiles.count} files
            </p>
          </div>

          <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#242424]">
            <div className="flex items-center gap-2 mb-2">
              <FaFileAlt className="text-green-400" />
              <p className="text-gray-400 text-sm">Documents</p>
            </div>
            <p className="text-white text-xl font-bold">
              {analytics.storageBreakdown.documents.sizeMB} MB
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {analytics.storageBreakdown.documents.count} files
            </p>
          </div>

          <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#242424]">
            <div className="flex items-center gap-2 mb-2">
              <FaDatabase className="text-purple-400" />
              <p className="text-gray-400 text-sm">Website Data</p>
            </div>
            <p className="text-white text-xl font-bold">
              {analytics.storageBreakdown.websiteData.sizeMB} MB
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {analytics.storageBreakdown.websiteData.count} websites
            </p>
          </div>

          <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#242424]">
            <div className="flex items-center gap-2 mb-2">
              <FaImage className="text-yellow-400" />
              <p className="text-gray-400 text-sm">Previews</p>
            </div>
            <p className="text-white text-xl font-bold">
              {analytics.storageBreakdown.websitePreviews.sizeMB} MB
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {analytics.storageBreakdown.websitePreviews.count} previews
            </p>
          </div>
        </div>
      </div>

      {/* File Type Breakdown */}
      {Object.keys(analytics.fileTypeBreakdown).length > 0 && (
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
          <h3 className="text-white font-bold text-lg mb-4">
            File Type Breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.fileTypeBreakdown)
              .sort((a, b) => b[1].sizeBytes - a[1].sizeBytes)
              .map(([fileType, data]) => {
                const percentage =
                  analytics.totalStorageBytes > 0
                    ? (data.sizeBytes / analytics.totalStorageBytes) * 100
                    : 0;
                return (
                  <div key={fileType} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{fileType}</span>
                      <span className="text-white font-medium">
                        {data.sizeMB} MB ({data.count} files)
                      </span>
                    </div>
                    <div className="w-full bg-[#0A0A0A] rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Websites List */}
      {analytics.websitesList.length > 0 && (
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
          <h3 className="text-white font-bold text-lg mb-4">
            Websites Details
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#242424]">
                  <th className="text-left text-gray-400 text-sm font-medium pb-3">
                    Title
                  </th>
                  <th className="text-left text-gray-400 text-sm font-medium pb-3">
                    Status
                  </th>
                  <th className="text-left text-gray-400 text-sm font-medium pb-3">
                    Data Size
                  </th>
                  <th className="text-left text-gray-400 text-sm font-medium pb-3">
                    Preview
                  </th>
                  <th className="text-left text-gray-400 text-sm font-medium pb-3">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.websitesList.map((website) => (
                  <tr
                    key={website.id}
                    className="border-b border-[#242424] hover:bg-[#0A0A0A] transition-colors"
                  >
                    <td className="py-3 text-white">{website.title}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          website.status === "published"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {website.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">
                      {formatBytes(website.dataSize)}
                    </td>
                    <td className="py-3">
                      {website.hasPreview ? (
                        <span className="text-green-400 text-xs">✓ Yes</span>
                      ) : (
                        <span className="text-gray-500 text-xs">✗ No</span>
                      )}
                    </td>
                    <td className="py-3 text-gray-400 text-sm">
                      {new Date(website.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="text-center text-gray-500 text-sm">
        Last updated: {new Date(analytics.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
};

export default WebsiteAnalyticsView;
