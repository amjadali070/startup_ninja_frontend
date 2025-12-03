import React from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaCreditCard,
} from "react-icons/fa";
import type { ExtendedUserDetails } from "../../../types/admin";

interface SubscriptionTabProps {
  user: ExtendedUserDetails;
}

const SubscriptionTab: React.FC<SubscriptionTabProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
        <div className="flex justify-between items-start border-b border-[#242424] pb-6">
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">
              Current Plan
            </h3>
            <p className="text-gray-400 text-sm">
              Manage subscription and billing
            </p>
          </div>
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide ${
              user.subscription.plan === "Enterprise"
                ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                : user.subscription.plan === "Pro"
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                : "bg-gray-600/20 text-gray-400 border border-gray-500/30"
            }`}
          >
            {user.subscription.plan}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          <div className="bg-[#2A2A2A] p-4 rounded-lg border border-[#333] flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                user.subscription.status === "active"
                  ? "bg-green-500/20 text-green-500"
                  : "bg-red-500/20 text-red-500"
              }`}
            >
              {user.subscription.status === "active" ? (
                <FaCheckCircle />
              ) : (
                <FaTimesCircle />
              )}
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                Status
              </p>
              <p
                className={`font-bold capitalize ${
                  user.subscription.status === "active"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {user.subscription.status}
              </p>
            </div>
          </div>

          <div className="bg-[#2A2A2A] p-4 rounded-lg border border-[#333] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
              <FaCalendarAlt />
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                Next Billing
              </p>
              <p className="text-white font-bold">
                {new Date(user.subscription.nextBillingDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="bg-[#2A2A2A] p-4 rounded-lg border border-[#333] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center">
              <FaCreditCard />
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                Amount
              </p>
              <p className="text-white font-bold text-lg">
                ${user.subscription.amount}
                <span className="text-sm text-gray-500 font-normal">
                  /{user.subscription.interval}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#242424]">
        <h3 className="text-white font-semibold mb-6">Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#242424]">
                <th className="pb-3 text-gray-400 font-medium text-sm">Date</th>
                <th className="pb-3 text-gray-400 font-medium text-sm">
                  Description
                </th>
                <th className="pb-3 text-gray-400 font-medium text-sm">
                  Amount
                </th>
                <th className="pb-3 text-gray-400 font-medium text-sm">
                  Status
                </th>
                <th className="pb-3 text-gray-400 font-medium text-sm">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody>
              {user.transactions.map((txn) => (
                <tr
                  key={txn.id}
                  className="border-b border-[#242424] last:border-0"
                >
                  <td className="py-4 text-white text-sm">
                    {new Date(txn.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 text-gray-300 text-sm">
                    {txn.description}
                  </td>
                  <td className="py-4 text-white font-medium text-sm">
                    ${txn.amount}
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs capitalize ${
                        txn.status === "succeeded"
                          ? "bg-green-500/20 text-green-400"
                          : txn.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="text-blue-400 hover:text-blue-300 text-sm">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTab;
