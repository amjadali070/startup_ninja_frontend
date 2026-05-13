import React from "react";
import { Lead } from "../../../types/admin";
import { FaUser, FaBuilding, FaDollarSign } from "react-icons/fa";

interface LeadsListViewProps {
  leads: Lead[];
}

const LeadsListView: React.FC<LeadsListViewProps> = ({ leads }) => {
  if (!leads || leads.length === 0) {
    return (
      <div className="text-center py-12 bg-[#1A1A1A] rounded-2xl border border-[#242424] text-gray-400">
        No sales leads found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {leads.map((lead) => {
        const fullName =
          `${lead.firstName || ""} ${lead.lastName || ""}`.trim() ||
          lead.name ||
          "Unnamed Lead";
        const leadStatus = lead.status || lead.leadStatus || "new";
        const isClosed =
          String(leadStatus).toLowerCase().includes("closed") ||
          String(leadStatus).toLowerCase().includes("converted");

        return (
        <div
          key={lead._id}
          className="bg-[#1A1A1A] p-4 rounded-xl border border-[#242424] hover:border-[#333] transition-all group"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FaUser className="text-blue-500" />
              </div>
              <div>
                <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors">
                  {fullName}
                </h3>
                <p className="text-xs text-gray-500">{lead.email}</p>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-md text-[10px] font-medium uppercase ${
              isClosed
                ? "bg-green-500/10 text-green-500"
                : "bg-blue-500/10 text-blue-500"
            }`}>
              {leadStatus}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#242424]">
            <div className="flex items-center gap-2">
              <FaBuilding className="text-gray-500 text-xs" />
              <span className="text-xs text-gray-400 truncate">
                {lead.company || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaDollarSign className="text-gray-500 text-xs" />
              <span className="text-xs text-gray-400">
                {lead.value ? `$${lead.value}` : "$0"}
              </span>
            </div>
          </div>
          
          <p className="text-[10px] text-gray-500 mt-3 italic">
            Created: {new Date(lead.createdAt).toLocaleDateString()}
          </p>
        </div>
        );
      })}
    </div>
  );
};

export default LeadsListView;
