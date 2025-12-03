import React from "react";
import { FaArrowLeft, FaTools, FaHdd, FaCheckCircle } from "react-icons/fa";
import type { ExtendedUserDetails } from "../../../types/admin";

interface ResourceForm {
  chatTokensLimit: number;
  imageGenLimit: number;
  websiteLimit: number;
  socialPostLimit: number;
  features: string[];
}

interface ManageResourcesViewProps {
  user: ExtendedUserDetails;
  resourceForm: ResourceForm;
  setResourceForm: React.Dispatch<React.SetStateAction<ResourceForm>>;
  setViewingResources: (viewing: boolean) => void;
  handleUpdateResources: () => void;
  toggleFeature: (feature: string) => void;
}

const ManageResourcesView: React.FC<ManageResourcesViewProps> = ({
  user,
  resourceForm,
  setResourceForm,
  setViewingResources,
  handleUpdateResources,
  toggleFeature,
}) => {
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

export default ManageResourcesView;
