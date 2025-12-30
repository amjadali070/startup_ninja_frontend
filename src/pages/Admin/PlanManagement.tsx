import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.tsx';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { authService } from '../../services/auth.ts';
import { planService, Plan, PlanLimit } from '../../services/plan.ts';
import { toast } from 'react-hot-toast';
import { FiSave, FiEdit2 } from 'react-icons/fi';

const PlanCard: React.FC<{ plan: Plan; onUpdate: (id: string, updates: Partial<Plan>) => Promise<void> }> = ({ plan, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState<Plan>(plan);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(plan._id, { limits: editedPlan.limits, price: editedPlan.price }); // Only update limits/price for now
      setIsEditing(false);
      toast.success(`${plan.name} updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${plan.name}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLimitChange = (key: keyof PlanLimit, value: number | boolean) => {
    setEditedPlan({
      ...editedPlan,
      limits: {
        ...editedPlan.limits,
        [key]: value
      }
    });
  };

  const limitsConfig: { key: keyof PlanLimit; label: string; type: 'number' | 'boolean' }[] = [
    { key: 'ai_chat_messages', label: 'AI Chat Messages', type: 'number' },
    { key: 'chat_bot_messages', label: 'Chat Bot Messages', type: 'number' },
    { key: 'social_posts', label: 'Social Posts', type: 'number' },
    { key: 'generated_images', label: 'Generated Images', type: 'number' },
    { key: 'website_sessions', label: 'Website Sessions', type: 'number' },
    { key: 'social_accounts', label: 'Social Accounts', type: 'number' },
    { key: 'pager_websites', label: 'Pager Websites', type: 'number' },
    { key: 'hosted_websites', label: 'Hosted Websites', type: 'number' },
    { key: 'multi_pages', label: 'Multi-Page Support', type: 'boolean' },
  ];

  return (
    <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{plan.name}</h3>
          <p className="text-gray-400 text-sm">{plan.description}</p>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-white p-2 bg-white/5 rounded-lg">
            <FiEdit2 size={18} />
          </button>
        ) : (
          <button onClick={handleSave} disabled={loading} className="text-green-500 hover:text-green-400 p-2 bg-green-500/10 rounded-lg">
             {loading ? <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /> : <FiSave size={18} />}
          </button>
        )}
      </div>

      <div className="space-y-4 flex-grow">
         {/* Price */}
         <div className="border-b border-white/10 pb-4 mb-4">
            <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Price ($)</label>
            <input 
                type="number" 
                value={editedPlan.price}
                disabled={!isEditing}
                onChange={(e) => setEditedPlan({...editedPlan, price: parseFloat(e.target.value)})}
                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed focus:border-red-500 outline-none"
             />
         </div>

         {/* Limits Grid */}
         <div className="grid grid-cols-1 gap-3">
             {limitsConfig.map((limit) => (
                 <div key={limit.key} className="flex justify-between items-center group">
                     <span className="text-sm text-gray-400 group-hover:text-gray-300">{limit.label}</span>
                     {limit.type === 'boolean' ? (
                         <input 
                            type="checkbox"
                            checked={!!editedPlan.limits[limit.key]}
                            disabled={!isEditing}
                            onChange={(e) => handleLimitChange(limit.key, e.target.checked)}
                            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-red-600 focus:ring-red-500 disabled:opacity-50"
                         />
                     ) : (
                         <input 
                            type="number"
                            value={editedPlan.limits[limit.key] as number}
                            disabled={!isEditing}
                            onChange={(e) => handleLimitChange(limit.key, parseInt(e.target.value))}
                            className="w-24 bg-black/20 border border-white/10 rounded px-2 py-1 text-sm text-right text-white disabled:opacity-50 focus:border-red-500 outline-none"
                         />
                     )}
                 </div>
             ))}
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
      fetchPlans(); // Refresh
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
      <main className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Subscription Plans</h1>
                <p className="text-gray-400 cursor-text">Manage pricing and feature limits for all subscription tiers.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500" />
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
