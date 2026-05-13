import React from "react";
import { Contract } from "../../../types/admin";
import { FaFileContract, FaUserTie, FaMoneyBillWave, FaFlag } from "react-icons/fa";

interface ContractsListViewProps {
  contracts: Contract[];
}

const ContractsListView: React.FC<ContractsListViewProps> = ({ contracts }) => {
  if (!contracts || contracts.length === 0) {
    return (
      <div className="text-center py-12 bg-[#1A1A1A] rounded-2xl border border-[#242424] text-gray-400">
        No AI contracts found
      </div>
    );
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-500 bg-red-500/10';
      case 'medium': return 'text-amber-500 bg-amber-500/10';
      case 'low': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {contracts.map((contract) => (
        <div
          key={contract._id}
          className="bg-[#1A1A1A] p-4 rounded-xl border border-[#242424] hover:border-[#333] transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <FaFileContract className="text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm line-clamp-1">{contract.contractTitle}</h3>
                  <p className="text-[10px] text-gray-500">{contract.type || 'Legal Document'}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-md text-[9px] font-medium uppercase">
                  {contract.contractStatus}
                </span>
                {contract.priority && (
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-medium uppercase flex items-center gap-1 ${getPriorityColor(contract.priority)}`}>
                    <FaFlag className="text-[8px]" />
                    {contract.priority}
                  </span>
                )}
              </div>
            </div>

            {contract.purpose && (
              <p className="text-[11px] text-gray-400 mb-4 line-clamp-2 italic">
                "{contract.purpose}"
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-[#242424]/50 p-2 rounded-lg border border-[#333]">
                <p className="text-[9px] text-gray-500 uppercase mb-0.5">Contract Worth</p>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <FaMoneyBillWave className="text-xs" />
                  <span className="text-xs font-bold">${typeof contract.contractWorth === 'number' ? contract.contractWorth.toLocaleString() : contract.contractWorth || '0'}</span>
                </div>
              </div>
              <div className="bg-[#242424]/50 p-2 rounded-lg border border-[#333]">
                <p className="text-[9px] text-gray-500 uppercase mb-0.5">Parties</p>
                <div className="flex items-center gap-1.5 text-blue-400">
                  <FaUserTie className="text-xs" />
                  <span className="text-xs font-bold">{Array.isArray((contract as any).parties) ? (contract as any).parties.length : 2} Involved</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#242424]">
            <span className="text-[10px] text-gray-500">Created: {new Date(contract.createdAt).toLocaleDateString()}</span>
            {/* <button className="text-[10px] text-emerald-500 hover:underline font-medium">
              View Details
            </button> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContractsListView;
