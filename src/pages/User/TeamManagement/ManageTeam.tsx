import { type FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useAuth } from "../../../hooks/useAuth";
import { FiUserPlus, FiDownload, FiFilter } from "react-icons/fi";
import TeamTable from "../../../components/team-management/TeamTable";
import AddMemberModal from "../../../components/team-management/AddMemberModal";
import toast from "react-hot-toast";

const ManageTeam: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  const handleAddMember = (data: any) => {
    console.log("Adding new member:", data);
    toast.success("Team member added successfully!");
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

              <button className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 rounded-2xl py-3.5 px-6 text-sm font-medium transition-all active:scale-95">
                <FiDownload className="w-5 h-5 text-red-500/70" />
                Export Team
              </button>

              <button className="flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 rounded-2xl p-3.5 transition-all">
                <FiFilter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="mb-4 animate-fade-in-up">
            <TeamTable />
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
