import { type FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";
import { FiUserPlus, FiLoader } from "react-icons/fi";
import TeamTable from "../../../components/team-management/TeamTable";
import AddMemberModal from "../../../components/team-management/AddMemberModal";
import toast from "react-hot-toast";
import { teamService, TeamMember } from "../../../services/team";

const ManageTeam: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await teamService.getMembers();
      if (res.success && res.data) {
        setMembers(res.data);
      } else {
        toast.error(res.message || "Failed to load team members");
      }
    } catch (err) {
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Team logout failed:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const handleOpenSettings = () => {
    navigate("/settings");
  };

  const handleAddMember = async (data: any) => {
    const res = await teamService.addMember(data);
    if (res.success) {
      toast.success("Team member added successfully!");
      fetchMembers();
    } else {
      toast.error(res.message || "Failed to add team member");
    }
  };


  return (
    <DashboardLayout
      activePath="/manage-team"
      title="Manage Team"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto">
        <div className="p-3 sm:p-4 lg:p-8 text-white font-plus-jakarta max-w-full mx-auto">

          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">Team Management</h1>
              <p className="text-white/40 max-w-2xl text-lg leading-relaxed">
                Invite members, manage roles and monitor your team's access levels from a central control panel.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="group flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-2xl py-3.5 px-7 text-sm font-semibold transition-all shadow-lg shadow-red-900/20 active:scale-95"
              >
                <FiUserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Add Member
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="mb-4 animate-fade-in-up">
            {loading ? (
              <div className="flex justify-center p-12">
                <FiLoader className="w-8 h-8 animate-spin text-red-500" />
              </div>
            ) : (
              <TeamTable members={members} onRefresh={fetchMembers} />
            )}
          </div>

          <AddMemberModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onConfirm={handleAddMember}
          />
        </div>
      </main>
    </DashboardLayout>
  );
};

export default ManageTeam;
