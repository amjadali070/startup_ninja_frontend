import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.tsx';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { authService } from '../../services/auth.ts';
import { planService, Plan, PlanLimit } from '../../services/plan.ts';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiCheck, FiCpu, FiGlobe, FiShare2, FiUsers, FiFileText, FiTrendingUp } from 'react-icons/fi';

const PlanCard: React.FC<{ plan: Plan; onUpdate: (id: string, updates: Partial<Plan>) => Promise<void> }> = ({ plan, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState<Plan>(plan);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditedPlan(plan);
  }, [plan, isEditing]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Auto-generate features based on limits
      const l = editedPlan.limits;
      const generatedFeatures = [
        `${l.ai_chat_messages === -1 ? 'Unlimited' : l.ai_chat_messages} AI Chat messages`,
        `${l.social_posts === -1 ? 'Unlimited' : l.social_posts} Social media posts`,
        `${l.ai_post_writer === -1 ? 'Unlimited' : l.ai_post_writer} AI Post Writer`,
        `${l.generated_images === -1 ? 'Unlimited' : l.generated_images} AI Image generation`,
        `${l.website_creation === -1 ? 'Unlimited' : l.website_creation} Website Creation`,
        `${l.website_hosting === -1 ? 'Unlimited' : l.website_hosting} Website Hosting`,
        l.single_page_website ? "Single Page Website" : "",
        l.multi_page_website ? "Multipage Website" : "",
        `${l.facebook_page_connect === -1 ? 'Unlimited' : l.facebook_page_connect} Facebook Page Connect`,
        `${l.chat_bot_messages === -1 ? 'Unlimited' : l.chat_bot_messages} AI Chatbot Support Message`,
        `${l.web_builder_sessions === -1 ? 'Unlimited' : l.web_builder_sessions} Web Builder Sessions`,
        `${l.team_members === -1 ? 'Unlimited' : l.team_members} Team Members`,
        `${l.legal_contracts === -1 ? 'Unlimited' : l.legal_contracts} AI Legal Contracts`,
        `${l.legal_contract_section_revisions === -1 ? 'Unlimited' : l.legal_contract_section_revisions} Contract Section Revisions`,
        `${l.sales_leads === -1 ? 'Unlimited' : l.sales_leads} Sales Leads`,
        `${l.sales_projects === -1 ? 'Unlimited' : l.sales_projects} Sales Projects`
      ].filter(feature => feature !== "");

      await onUpdate(plan._id, { 
        limits: editedPlan.limits, 
        price: editedPlan.price,
        features: generatedFeatures
      });
      setIsEditing(false);
      toast.success(`${plan.name} updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${plan.name}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPlan(plan);
  };

  const handleLimitChange = (key: keyof PlanLimit, value: number | boolean) => {
    const newLimits: any = { ...editedPlan.limits };
    newLimits[key] = value;

    if (key === 'single_page_website') {
       if (value === true) {
           newLimits.multi_page_website = false;
       } else {
           newLimits.multi_page_website = true;
       }
    }
    else if (key === 'multi_page_website') {
       if (value === true) {
           newLimits.single_page_website = false;
       } else {
           newLimits.single_page_website = true;
       }
    }

    setEditedPlan({
      ...editedPlan,
      limits: newLimits
    });
  };

  // Grouped configuration for better layout
  const limitGroups = [
    {
        title: "AI Capabilities",
        icon: <FiCpu className="text-purple-500" />,
        limits: [
            { key: 'ai_chat_messages', label: 'AI Chat Messages', type: 'number' },
            { key: 'ai_post_writer', label: 'AI Post Writer', type: 'number' },
            { key: 'generated_images', label: 'Image Generations', type: 'number' },
            { key: 'chat_bot_messages', label: 'Bot Messages', type: 'number' },
        ] as const
    },
    {
        title: "Social Media",
        icon: <FiShare2 className="text-blue-500" />,
        limits: [
            { key: 'social_posts', label: 'Post Limit', type: 'number' },
            { key: 'facebook_page_connect', label: 'Connected Accounts', type: 'number' },
        ] as const
    },
    {
        title: "Web Builder",
        icon: <FiGlobe className="text-green-500" />,
        limits: [
            { key: 'website_creation', label: 'Created Sites', type: 'number' },
            { key: 'website_hosting', label: 'Hosted Sites', type: 'number' },
            { key: 'web_builder_sessions', label: 'Builder Sessions', type: 'number' },
            { key: 'single_page_website', label: 'Single Page', type: 'boolean' },
            { key: 'multi_page_website', label: 'Multi Page', type: 'boolean' },
        ] as const
    },
    {
        title: "Team",
        icon: <FiUsers className="text-orange-500" />,
        limits: [
            { key: 'team_members', label: 'Team Members', type: 'number' },
        ] as const
    },
    {
        title: "Ninja Sales",
        icon: <FiTrendingUp className="text-red-500" />,
        limits: [
            { key: 'sales_leads', label: 'Sales Leads', type: 'number' },
            { key: 'sales_projects', label: 'Sales Projects', type: 'number' }
        ] as const
    },
    {
        title: "Ninja Legal",
        icon: <FiFileText className="text-indigo-500" />,
        limits: [
            { key: 'legal_contracts', label: 'AI Contracts', type: 'number' },
            { key: 'legal_contract_section_revisions', label: 'Contract Section Revisions', type: 'number' }
        ] as const
    }
  ];

  return (
    <div className="relative group bg-[#161616] border border-white/5 rounded-2xl flex flex-col h-full hover:border-red-500/20 transition-all duration-300 shadow-xl overflow-hidden">
      
      {/* Card Header Background Effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Header Section */}
      <div className="p-5 pb-4 border-b border-white/5 bg-white/[0.01]">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-white font-plus-jakarta tracking-tight">{plan.name}</h3>
                    {plan.isPopular && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gradient-to-r from-red-600 to-red-500 text-white uppercase tracking-wider shadow-lg shadow-red-900/40">Popular</span>}
                </div>
                <p className="text-gray-400 text-xs leading-relaxed max-w-[95%] min-h-[40px]">{plan.description}</p>
            </div>
            <div className="text-right">
                {isEditing ? (
                    <div className="flex flex-col items-end gap-1">
                        <label className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Price/mo</label>
                        <div className="relative group/price">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/price:text-white transition-colors text-xs">$</span>
                            <input 
                                type="number"
                                value={editedPlan.price}
                                onChange={(e) => setEditedPlan({...editedPlan, price: parseFloat(e.target.value)})}
                                className="w-20 pl-4 pr-1 py-1 bg-[#0A0A0A] border border-gray-800 rounded text-white font-bold text-right text-sm focus:border-red-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-baseline justify-end gap-0.5">
                            <span className="text-2xl font-bold font-space-grotesk text-white">${plan.price}</span>
                            <span className="text-gray-500 text-xs font-medium">/mo</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-grow p-4 space-y-6">
         
         {limitGroups.map((group, idx) => (
             <div key={idx}>
                 <div className="flex items-center gap-2 mb-3">
                     <span className="p-1 rounded bg-white/5 border border-white/5 text-xs">{group.icon}</span>
                     <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{group.title}</h4>
                 </div>
                 <div className="grid grid-cols-1 gap-2">
                     {group.limits.map((limit: any) => {
                         const key = limit.key as keyof PlanLimit;
                         return (
                         <div key={key} className="bg-[#0F0F0F] rounded-lg px-3 py-2 border border-gray-800/50 hover:border-gray-700 transition-colors flex items-center justify-between min-h-[40px]">
                             <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mr-2">{limit.label}</label>
                             {isEditing ? (
                                 limit.type === 'boolean' ? (
                                    <div className="flex items-center justify-end">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer"
                                                checked={(!!editedPlan.limits && !!editedPlan.limits[key]) || false}
                                                onChange={(e) => handleLimitChange(key, e.target.checked)}
                                            />
                                            <div className="w-7 h-4 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-red-600 peer-checked:after:bg-white"></div>
                                        </label>
                                    </div>
                                 ) : (
                                     <input 
                                        type="number"
                                        value={editedPlan.limits ? (editedPlan.limits[key] as number) : 0}
                                        onChange={(e) => handleLimitChange(key, parseInt(e.target.value))}
                                        className="w-16 bg-[#161616] border border-gray-800 rounded px-1.5 py-0.5 text-xs text-white text-right font-medium focus:border-red-500 outline-none transition-colors"
                                        placeholder="0"
                                     />
                                 )
                             ) : (
                                 <div className="text-white font-medium text-xs truncate">
                                     {limit.type === 'boolean' ? (
                                         <span className={`inline-flex items-center gap-1 ${editedPlan.limits && editedPlan.limits[key] ? "text-green-400" : "text-gray-600"}`}>
                                             <span className={`w-1 h-1 rounded-full ${editedPlan.limits && editedPlan.limits[key] ? "bg-green-400" : "bg-gray-600"}`}></span>
                                             {editedPlan.limits && editedPlan.limits[key] ? 'On' : 'Off'}
                                         </span>
                                     ) : (
                                         (editedPlan.limits && editedPlan.limits[key]) === -1 ? 'Unlim.' : ((editedPlan.limits && editedPlan.limits[key]) || 0).toLocaleString()
                                     )}
                                 </div>
                             )}
                         </div>
                     )})}
                 </div>
             </div>
         ))}
      </div>

      {/* Actions */}
      <div className="p-4 pt-0 mt-auto">
        <div className="pt-4 border-t border-white/5">
            {isEditing ? (
                <div className="grid grid-cols-2 gap-2">
                    <button 
                        onClick={handleCancel}
                        disabled={loading}
                        className="w-full px-3 py-2 rounded-lg text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Saving</span>
                            </>
                        ) : (
                            <>
                                <FiCheck size={14} />
                                <span>Save</span>
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 text-white rounded-lg text-xs font-bold transition-all group"
                >
                    <FiEdit2 className="text-gray-500 group-hover:text-red-500 transition-colors" size={14} />
                    <span>Edit Plan</span>
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

const PlanManagement: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
        const response = await planService.getAllPlans();
        if (response.success && response.data) {
            setPlans(response.data);
        }
    } catch (error) {
        toast.error("Failed to fetch plans");
    } finally {
        setLoading(false);
    }
  };

  const handleUpdatePlan = async (id: string, updates: Partial<Plan>) => {
      await planService.updatePlan(id, updates);
      fetchPlans();
  };

  const handleLogout = async () => {
    try {
      const userData = { user: { userId: user?.id || '' } };
      await authService.logout(userData);
      logout();
    } catch (error) {
      console.error('Logout failed:', error);
      logout();
    }
  };

  return (
    <DashboardLayout 
      activePath="/admin-dashboard/plans" 
      title="Plan Management"
      onLogout={handleLogout}
      onSettings={() => navigate('/settings')}
    >
      <main className="flex-1 overflow-y-auto bg-black">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-white font-space-grotesk tracking-tight">Subscription Plans</h1>
                    <p className="text-gray-400 mt-2 text-lg font-light">Manage pricing tiers and feature limits for your platform.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>Live Configurations</span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-32">
                   <div className="relative">
                       <div className="w-16 h-16 border-4 border-gray-800 rounded-full"></div>
                       <div className="w-16 h-16 border-4 border-t-red-600 rounded-full animate-spin absolute top-0 left-0"></div>
                   </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pb-20">
                    {plans.map(plan => (
                        <PlanCard key={plan._id} plan={plan} onUpdate={handleUpdatePlan} />
                    ))}
                </div>
            )}
        </div>
      </main>
    </DashboardLayout>
  );
};

export default PlanManagement;
