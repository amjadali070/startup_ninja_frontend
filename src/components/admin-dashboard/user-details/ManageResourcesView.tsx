import React, { useState } from "react";
import { FaArrowLeft, FaSlidersH, FaMoneyCheckAlt } from "react-icons/fa";
import { FiCpu, FiShare2, FiGlobe, FiUsers, FiTrendingUp, FiFileText } from "react-icons/fi";
import type { ExtendedUserDetails } from "../../../types/admin";

export interface ResourceForm {
  chatTokensLimit: number;
  imageGenLimit: number;
  websiteLimit: number;
  socialPostLimit: number;
  legalContractsLimit: number;
  contractRevisionsLimit: number;
  salesLeadsLimit: number;
  salesProjectsLimit: number;
  aiPostWriterLimit: number;
  chatBotMessagesLimit: number;
  fbPageConnectLimit: number;
  websiteHostingLimit: number;
  webBuilderSessionsLimit: number;
  singlePageWebsite: boolean;
  multiPageWebsite: boolean;
  teamMembersLimit: number;
  addOnCharge: number;
  features: string[];
  activeFeatureList: Record<string, number>;
}

interface ManageResourcesViewProps {
  user: ExtendedUserDetails;
  resourceForm: ResourceForm;
  setResourceForm: React.Dispatch<React.SetStateAction<ResourceForm>>;
  setViewingResources: (viewing: boolean) => void;
  handleUpdateResources: () => Promise<void> | void;
  toggleFeature: (feature: string) => void;
}

const FEATURE_ITEMS = [
  { key: "ai_chat", label: "Ai Chat" },
  { key: "ai_image_gen", label: "Ai image gen" },
  { key: "web_builder", label: "Web Builder" },
  { key: "social_pro", label: "Social Pro" },
  { key: "ninja_legal", label: "Ninja Legal" },
  { key: "ninja_sales", label: "Ninja Sales" },
];

const ManageResourcesView: React.FC<ManageResourcesViewProps> = ({
  user,
  resourceForm,
  setResourceForm,
  setViewingResources,
  handleUpdateResources,
  toggleFeature
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const onSave = async () => {
    setIsSaving(true);
    try {
      await handleUpdateResources();
    } finally {
      setIsSaving(false);
    }
  };

  const isFeatureActive = (key: string) => (resourceForm.activeFeatureList?.[key] ?? 0) === 1;

  const renderInput = (label: string, field: keyof ResourceForm, used?: number | string) => (
    <div className="bg-[#0F0F0F] rounded-lg px-4 py-3 border border-gray-800/50 hover:border-gray-700 transition-colors flex items-center justify-between min-h-[44px]">
      <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mr-2">
        {label}
      </label>
      <div className="flex items-center gap-3">
        {used !== undefined && (
          <span className="text-xs text-gray-600 font-mono">
            {used} /
          </span>
        )}
        <input
          type="number"
          value={resourceForm[field] as number}
          onChange={(e) => setResourceForm({ ...resourceForm, [field]: Number(e.target.value) })}
          className="w-20 bg-[#161616] border border-gray-800 rounded px-2 py-1 text-sm text-white text-right font-medium focus:border-red-500 outline-none transition-colors"
          placeholder="0"
        />
      </div>
    </div>
  );

  const renderToggle = (label: string, field: keyof ResourceForm) => (
    <div className="bg-[#0F0F0F] rounded-lg px-4 py-3 border border-gray-800/50 hover:border-gray-700 transition-colors flex items-center justify-between min-h-[44px]">
      <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mr-2">
        {label}
      </label>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
            type="checkbox" 
            className="sr-only peer"
            checked={(resourceForm[field] as boolean) || false}
            onChange={(e) => {
              const val = e.target.checked;
              const updates: any = { [field]: val };
              if (field === 'singlePageWebsite' && val) updates.multiPageWebsite = false;
              if (field === 'multiPageWebsite' && val) updates.singlePageWebsite = false;
              setResourceForm({ ...resourceForm, ...updates });
            }}
        />
        <div className="w-8 h-5 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600 peer-checked:after:bg-white"></div>
      </label>
    </div>
  );

  return (
    <div className="animate-fade-in w-full">
      <div className="mb-8">
        <button
          onClick={() => setViewingResources(false)}
          disabled={isSaving}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaArrowLeft /> Back to Profile
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#161616] p-6 rounded-2xl border border-white/5 gap-4 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600/30 to-transparent"></div>
          <div>
            <h1 className="text-2xl font-bold text-white font-plus-jakarta tracking-tight flex items-center gap-3">
              <FaSlidersH className="text-red-500" /> Manage Custom Limits
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-[95%]">
              Manually override base plan limits or configure explicit features for {user?.fullname || user?.username}.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setViewingResources(false)}
              disabled={isSaving}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-transparent transition-all font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all font-bold text-xs shadow-lg shadow-red-900/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8 bg-[#161616] p-6 rounded-2xl border border-white/5 shadow-xl">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-bold text-white">Active Feature List</h4>
            <p className="text-xs text-gray-400 mt-1">Toggle the feature keys that should be active for this custom plan.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURE_ITEMS.map((feature) => (
            <label key={feature.key} className="flex items-center gap-3 bg-[#0F0F0F] p-3 rounded-lg border border-gray-800/50 hover:border-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatureActive(feature.key)}
                onChange={() => toggleFeature(feature.key)}
                className="w-4 h-4 rounded-sm accent-red-500"
              />
              <span className="text-sm text-white">{feature.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
            {/* AI Capabilities */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="p-1.5 rounded bg-white/5 border border-white/5 text-sm"><FiCpu className="text-purple-500" /></span>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Capabilities</h4>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    {renderInput("AI Chat Messages", "chatTokensLimit", user?.usage?.chatTokensUsed?.toLocaleString())}
                    {renderInput("AI Post Writer", "aiPostWriterLimit", user?.usage?.aiPostWriterUsed)}
                    {renderInput("Image Generations", "imageGenLimit", user?.usage?.imageGenUsed)}
                    {renderInput("Bot Messages", "chatBotMessagesLimit", user?.usage?.chatBotMessagesUsed )}
                </div>
            </div>

            {/* Social Media */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="p-1.5 rounded bg-white/5 border border-white/5 text-sm"><FiShare2 className="text-blue-500" /></span>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Social Media</h4>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    {renderInput("Post Limit", "socialPostLimit", user?.usage?.socialPostsUsed)}
                    {renderInput("Connected Accounts", "fbPageConnectLimit" , user?.usage?.fbPageConnectUsed)}
                </div>
            </div>

            {/* Team */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="p-1.5 rounded bg-white/5 border border-white/5 text-sm"><FiUsers className="text-orange-500" /></span>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Team Workspace</h4>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    {renderInput("Team Members", "teamMembersLimit", user?.usage?.teamMembersUsed)}
                </div>
            </div>
        </div>

        <div className="space-y-6">
            {/* Web Builder */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="p-1.5 rounded bg-white/5 border border-white/5 text-sm"><FiGlobe className="text-green-500" /></span>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Web Builder</h4>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    {renderInput("Created Sites", "websiteLimit", user?.usage?.websiteUsed)}
                    {renderInput("Hosted Sites", "websiteHostingLimit" , user?.usage?.websiteHostingUsed)}
                    {renderInput("Builder Sessions", "webBuilderSessionsLimit", user?.usage?.webBuilderSessionsUsed)}
                    {renderToggle("Single Page", "singlePageWebsite")}
                    {renderToggle("Multi Page", "multiPageWebsite")}
                </div>
            </div>

            {/* Ninja Sales */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="p-1.5 rounded bg-white/5 border border-white/5 text-sm"><FiTrendingUp className="text-red-500" /></span>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ninja Sales</h4>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    {renderInput("Sales Leads", "salesLeadsLimit" , user?.usage?.salesLeadsUsed)}
                    {renderInput("Sales Projects", "salesProjectsLimit", user?.usage?.salesProjectsUsed )}
                </div>
            </div>

            {/* Ninja Legal */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <span className="p-1.5 rounded bg-white/5 border border-white/5 text-sm"><FiFileText className="text-indigo-500" /></span>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ninja Legal</h4>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    {renderInput("AI Contracts", "legalContractsLimit", user?.usage?.legalContractsUsed)}
                    {renderInput("Section Revisions", "contractRevisionsLimit", user?.usage?.legalContractRevisionsUsed)}
                </div>
            </div>
        </div>
      </div>

      <div className="mt-8 bg-[#161616] p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden">
        <div className="absolute left-0 top-0 w-1 h-full bg-blue-600/50"></div>
        <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
                <label className="text-sm font-bold tracking-tight text-white flex items-center gap-2 mb-2">
                    <FaMoneyCheckAlt className="text-blue-500" /> Recurring Add-on Override ($/mo)
                </label>
                <p className="text-xs text-gray-500 leading-relaxed max-w-[95%]">
                    Setting an amount above  explicitly attaches a fresh recurring "Add-on" billing unit atop their existing Stripe subscription cycle. Prorates are injected immediately.
                </p>
            </div>
            <div className="w-full md:w-64">
                <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold group-focus-within:text-white transition-colors">$</span>
                    <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={resourceForm.addOnCharge || 0}
                        onChange={(e) => setResourceForm({ ...resourceForm, addOnCharge: Number(e.target.value) })}
                        className="w-full bg-[#0A0A0A] border border-gray-800 rounded-lg pl-8 pr-4 py-3 text-white text-xl font-bold text-right focus:border-blue-500 outline-none transition-colors"
                        placeholder="0.00"
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ManageResourcesView;

