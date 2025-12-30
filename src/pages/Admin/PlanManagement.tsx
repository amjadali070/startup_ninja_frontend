import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.tsx';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { authService } from '../../services/auth.ts';
import { planService, Plan, PlanLimit } from '../../services/plan.ts';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiCheck } from 'react-icons/fi';

const PlanCard: React.FC<{ plan: Plan; onUpdate: (id: string, updates: Partial<Plan>) => Promise<void> }> = ({ plan, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState<Plan>(plan);
  const [loading, setLoading] = useState(false);

  // Reset edited state when prop changes or editing is cancelled
  useEffect(() => {
    setEditedPlan(plan);
  }, [plan, isEditing]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Auto-generate features based on limits to keep them in sync
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

  const limitsConfig: { key: keyof PlanLimit; label: string; type: 'number' | 'boolean' }[] = [
    { key: 'ai_chat_messages', label: 'AI Chat Messages', type: 'number' },
    { key: 'social_posts', label: 'Social Media Posts', type: 'number' },
    { key: 'ai_post_writer', label: 'AI Post Writer', type: 'number' },
    { key: 'generated_images', label: 'AI Image Generation', type: 'number' },
    { key: 'website_creation', label: 'Website Creation', type: 'number' },
    { key: 'website_hosting', label: 'Website Hosting', type: 'number' },
    { key: 'single_page_website', label: 'Single Page Website', type: 'boolean' },
    { key: 'multi_page_website', label: 'Multi Page Website', type: 'boolean' },
    { key: 'facebook_page_connect', label: 'Facebook Page Connect', type: 'number' },
    { key: 'chat_bot_messages', label: 'AI Chatbot Support Message', type: 'number' },
  ];

  return (
    <div className="bg-[#141414] border border-gray-800 rounded-2xl p-8 flex flex-col h-full hover:border-red-500/30 transition-all duration-300 shadow-lg">
      
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-800">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-white font-plus-jakarta tracking-tight">{plan.name}</h3>
          <p className="text-gray-400 text-sm mt-1">{plan.description}</p>
        </div>
        <div className="text-right pl-4">
          {isEditing ? (
             <div className="flex flex-col items-end gap-1">
                 <label className="text-xs text-gray-500 uppercase font-semibold">Price</label>
                 <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                     <input 
                        type="number"
                        value={editedPlan.price}
                        onChange={(e) => setEditedPlan({...editedPlan, price: parseFloat(e.target.value)})}
                        className="w-24 pl-6 pr-3 py-2 bg-[#0A0A0A] border border-gray-700 rounded-lg text-white font-bold focus:border-red-500 outline-none transition-colors text-right"
                     />
                 </div>
             </div>
          ) : (
            <div>
               <span className="text-3xl font-bold font-space-grotesk text-white">${plan.price}</span>
               <span className="text-gray-500 text-sm ml-1 font-medium">/mo</span>
            </div>
          )}
        </div>
      </div>

      {/* Limits Grid */}
      <div className="flex-grow">
         <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Plan Limits & Features</h4>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {limitsConfig.map((limit) => (
                 <div key={limit.key} className="bg-[#0F0F0F] rounded-xl p-4 border border-gray-800/50 flex flex-col justify-center">
                     <label className="text-xs text-gray-400 font-medium mb-2 block">{limit.label}</label>
                     {isEditing ? (
                         limit.type === 'boolean' ? (
                            <div className="flex items-center h-10">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer"
                                        checked={(!!editedPlan.limits && !!editedPlan.limits[limit.key]) || false}
                                        onChange={(e) => handleLimitChange(limit.key, e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-300">
                                        {editedPlan.limits && editedPlan.limits[limit.key] ? 'Enabled' : 'Disabled'}
                                    </span>
                                </label>
                            </div>
                         ) : (
                             <input 
                                type="number"
                                value={editedPlan.limits ? (editedPlan.limits[limit.key] as number) : 0}
                                onChange={(e) => handleLimitChange(limit.key, parseInt(e.target.value))}
                                className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg px-3 py-2 text-white font-medium focus:border-red-500 outline-none transition-colors"
                             />
                         )
                     ) : (
                         <div className="text-white font-semibold text-lg truncate">
                             {limit.type === 'boolean' ? (
                                 <span className={editedPlan.limits && editedPlan.limits[limit.key] ? "text-green-400" : "text-gray-500"}>
                                     {editedPlan.limits && editedPlan.limits[limit.key] ? 'Enabled' : 'Disabled'}
                                 </span>
                             ) : (
                                 (editedPlan.limits && editedPlan.limits[limit.key]) === -1 ? 'Unlimited' : ((editedPlan.limits && editedPlan.limits[limit.key]) || 0).toLocaleString()
                             )}
                         </div>
                     )}
                 </div>
             ))}
         </div>
      </div>

      {/* Actions */}
      <div className="mt-8 pt-6 border-t border-gray-800">
        {isEditing ? (
            <div className="flex items-center justify-end gap-3">
                <button 
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semi-bold transition-all shadow-lg hover:shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <FiCheck size={18} />
                            <span>Save Changes</span>
                        </>
                    )}
                </button>
            </div>
        ) : (
            <button 
                onClick={() => setIsEditing(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1A1A1A] hover:bg-[#252525] border border-gray-700 hover:border-gray-600 text-white rounded-xl text-sm font-medium transition-all group"
            >
                <FiEdit2 className="text-gray-400 group-hover:text-red-500 transition-colors" size={16} />
                <span>Edit This Plan</span>
            </button>
        )}
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
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white font-plus-jakarta">Subscription Plans</h1>
                <p className="text-gray-400 mt-2 text-lg">Manage pricing and feature access for all subscription tiers.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                   <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-800 border-t-red-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
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
