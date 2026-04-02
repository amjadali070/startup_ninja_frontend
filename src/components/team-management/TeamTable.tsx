import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiUser, FiCheckCircle, FiEdit } from "react-icons/fi";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  department: string;
  avatar?: string;
}

const dummyTeam: TeamMember[] = [
  {
    id: "1",
    name: "Amjad Ali",
    email: "amjad@startupninja.com",
    role: "Owner",
    status: "Active",
    department: "Operations",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah.c@startupninja.com",
    role: "Manager",
    status: "Active",
    department: "Sales",
  },
  {
    id: "3",
    name: "Michael Ross",
    email: "m.ross@startupninja.com",
    role: "Member",
    status: "Active",
    department: "Legal",
  },
  {
    id: "4",
    name: "Jessica Pearson",
    email: "jessica@startupninja.com",
    role: "Admin",
    status: "Active",
    department: "Management",
  },
  {
    id: "5",
    name: "Louis Litt",
    email: "louis.l@startupninja.com",
    role: "Member",
    status: "Inactive",
    department: "Finance",
  },
];

const TeamTable: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredTeam = dummyTeam.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Inactive":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="bg-[#0D0D0D] border border-white/5 rounded-[32px] overflow-hidden">
      {/* Table Header/Actions */}
      <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-red-500 transition-colors" />
          <input
            type="text"
            placeholder="Search team members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all w-full md:w-[320px]"
          />
        </div>

        <div className="flex items-center gap-3">
          <select className="bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/70 focus:outline-none focus:border-red-500/50 w-[160px]">
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="member">Member</option>
          </select>
          <select className="bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/70 focus:outline-none focus:border-red-500/50 w-[160px]">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/40 border-b border-white/5">Member</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/40 border-b border-white/5">Role</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/40 border-b border-white/5">Department</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/40 border-b border-white/5">Status</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white/40 border-b border-white/5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeam.map((member) => (
              <tr key={member.id} className="group hover:bg-white/[0.01] transition-colors">
                <td className="px-6 py-4 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/20 to-red-950/20 border border-white/10 flex items-center justify-center text-red-500 font-plus-jakarta font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <Link to={`/manage-team/${member.id}`} className="block hover:text-red-500 transition-colors">
                        <div className="font-medium">{member.name}</div>
                        <div className="text-white/40 text-sm">{member.email}</div>
                      </Link>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 border-b border-white/5">
                  <span className="text-white/70 text-sm">{member.role}</span>
                </td>
                <td className="px-6 py-4 border-b border-white/5 text-white/50 text-sm">
                  {member.department}
                </td>
                <td className="px-6 py-4 border-b border-white/5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(member.status)}`}>
                    {member.status === "Active" ? <FiCheckCircle className="text-xs" /> : <FiUser className="text-xs" />}
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 border-b border-white/5 text-right">
                  <button
                    onClick={() => navigate(`/manage-team/${member.id}/edit`)}
                    className="p-2 text-white/30 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Edit Member"
                  >
                    <FiEdit className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Placeholder */}
      <div className="p-6 flex items-center justify-between text-sm text-white/40">
        <div>Showing {filteredTeam.length} members</div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50" disabled>Previous</button>
          <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50" disabled>Next</button>
        </div>
      </div>
    </div>
  );
};

export default TeamTable;
