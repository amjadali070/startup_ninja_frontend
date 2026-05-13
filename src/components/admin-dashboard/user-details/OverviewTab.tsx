import React from "react";
import {
  FaRobot,
  FaImage,
  FaGlobe,
  FaShareAlt,
  FaCheckCircle,
  FaHistory,
  FaFileContract,
  FaFileSignature,
  FaUsers,
  FaProjectDiagram,
} from "react-icons/fa";
import type { ExtendedUserDetails } from "../../../types/admin";

interface OverviewTabProps {
  user: ExtendedUserDetails;
  formatDate: (dateString: string) => string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ user, formatDate }) => {
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
              {user.usage.chatTokensLimit === -1 ? "0" : Math.round(
                (user.usage.chatTokensUsed / user.usage.chatTokensLimit) * 100
              )}
              %
            </span>
          </div>
          <div className="w-full bg-[#2A2A2A] rounded-full h-2.5 mb-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${user.usage.chatTokensLimit === -1 ? 5 : Math.min(
                  100,
                  (user.usage.chatTokensUsed / user.usage.chatTokensLimit) * 100
                )}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>
              {user.usage.chatTokensUsed.toLocaleString()} /{" "}
              {user.usage.chatTokensLimit === -1 ? "Unlimited" : user.usage.chatTokensLimit.toLocaleString()}
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
              {user.usage.imageGenLimit === -1 ? "0" : Math.round(
                (user.usage.imageGenUsed / user.usage.imageGenLimit) * 100
              )}
              %
            </span>
          </div>
          <div className="w-full bg-[#2A2A2A] rounded-full h-2.5 mb-2 overflow-hidden">
            <div
              className="bg-purple-600 h-2.5 rounded-full"
              style={{
                width: `${user.usage.imageGenLimit === -1 ? 5 : Math.min(
                  100,
                  (user.usage.imageGenUsed / user.usage.imageGenLimit) * 100
                )}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>
              {user.usage.imageGenUsed} / {user.usage.imageGenLimit === -1 ? "Unlimited" : user.usage.imageGenLimit}
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
              {user.usage.websiteUsed || 0} / {user.usage.websiteLimit === -1 ? "Unlimited" : (user.usage.websiteLimit || 1)}
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
              {user.usage.socialPostLimit === -1 ? "Unlimited" : (user.usage.socialPostLimit || 1)}
            </span>
          </div>
        </div>

        {/* Ninja Legal: Contracts */}
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <FaFileContract className="text-indigo-500" /> AI Contracts
            </h3>
            <span className="text-gray-400 text-sm">
              {Math.round(
                ((user.usage.legalContractsUsed || 0) /
                  (user.usage.legalContractsLimit || 1)) *
                  100
              )}
              %
            </span>
          </div>
          <div className="w-full bg-[#2A2A2A] rounded-full h-2.5 mb-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  ((user.usage.legalContractsUsed || 0) /
                    (user.usage.legalContractsLimit || 1)) *
                    100
                )}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>
              {user.usage.legalContractsUsed || 0} /{" "}
              {user.usage.legalContractsLimit === -1 ? "Unlimited" : (user.usage.legalContractsLimit || 1)}
            </span>
          </div>
        </div>

        {/* Ninja Legal: Revisions */}
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <FaFileSignature className="text-cyan-500" /> Contract Revisions
            </h3>
            <span className="text-gray-400 text-sm">
              {Math.round(
                ((user.usage.legalContractRevisionsUsed || 0) /
                  (user.usage.legalContractRevisionsLimit || 1)) *
                  100
              )}
              %
            </span>
          </div>
          <div className="w-full bg-[#2A2A2A] rounded-full h-2.5 mb-2 overflow-hidden">
            <div
              className="bg-cyan-600 h-2.5 rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  ((user.usage.legalContractRevisionsUsed || 0) /
                    (user.usage.legalContractRevisionsLimit || 1)) *
                    100
                )}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>
              {user.usage.legalContractRevisionsUsed || 0} /{" "}
              {user.usage.legalContractRevisionsLimit === -1 ? "Unlimited" : (user.usage.legalContractRevisionsLimit || 1)}
            </span>
          </div>
        </div>

        {/* Ninja Sales: Leads */}
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <FaUsers className="text-orange-500" /> Sales Leads
            </h3>
            <span className="text-gray-400 text-sm">
              {Math.round(
                ((user.usage.salesLeadsUsed || 0) /
                  (user.usage.salesLeadsLimit || 1)) *
                  100
              )}
              %
            </span>
          </div>
          <div className="w-full bg-[#2A2A2A] rounded-full h-2.5 mb-2 overflow-hidden">
            <div
              className="bg-orange-600 h-2.5 rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  ((user.usage.salesLeadsUsed || 0) /
                    (user.usage.salesLeadsLimit || 1)) *
                    100
                )}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>
              {user.usage.salesLeadsUsed || 0} /{" "}
              {user.usage.salesLeadsLimit === -1 ? "Unlimited" : (user.usage.salesLeadsLimit || 1)}
            </span>
          </div>
        </div>

        {/* Ninja Sales: Projects */}
        <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <FaProjectDiagram className="text-red-500" /> Sales Projects
            </h3>
            <span className="text-gray-400 text-sm">
              {Math.round(
                ((user.usage.salesProjectsUsed || 0) /
                  (user.usage.salesProjectsLimit || 1)) *
                  100
              )}
              %
            </span>
          </div>
          <div className="w-full bg-[#2A2A2A] rounded-full h-2.5 mb-2 overflow-hidden">
            <div
              className="bg-red-600 h-2.5 rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  ((user.usage.salesProjectsUsed || 0) /
                    (user.usage.salesProjectsLimit || 1)) *
                    100
                )}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>
              {user.usage.salesProjectsUsed || 0} /{" "}
              {user.usage.salesProjectsLimit === -1 ? "Unlimited" : (user.usage.salesProjectsLimit || 1)}
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
          {user.activityLogs.length > 0 ? (
            user.activityLogs.slice(0, 5).map((log) => (
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
            ))
          ) : (
            <div className="text-center text-gray-500 py-4 text-sm">
              No Recent Activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
