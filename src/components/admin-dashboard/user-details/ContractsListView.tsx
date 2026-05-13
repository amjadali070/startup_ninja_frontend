import React from "react";
import { Contract } from "../../../types/admin";
import { FaFileContract, FaUserTie, FaClock } from "react-icons/fa";

interface ContractsListViewProps {
  contracts: Contract[];
}

const ContractsListView: React.FC<ContractsListViewProps> = ({ contracts }) => {
  if (!contracts || contracts.length === 0) {
    return (
      <div className="text-center py-12 bg-[#1A1A1A] rounded-2xl border border-[#242424] text-gray-400">
        No legal contracts found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {contracts.map((contract) => (
        <div
          key={contract._id}
          className="bg-[#1A1A1A] p-4 rounded-xl border border-[#242424] hover:border-[#333] transition-all"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <FaFileContract className="text-emerald-500" />
              </div>
              <div>
                <h3 className="text-white font-medium">{contract.contractTitle}</h3>
                <p className="text-xs text-gray-500">{contract.type}</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-md text-[10px] font-medium uppercase">
              {contract.contractStatus}
            </span>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#242424]">
            <div className="flex items-center gap-2 text-gray-400">
              <FaUserTie className="text-xs" />
              <span className="text-[10px]">{contract.clientName || 'Private Client'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <FaClock className="text-xs" />
              <span className="text-[10px]">{new Date(contract.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContractsListView;
