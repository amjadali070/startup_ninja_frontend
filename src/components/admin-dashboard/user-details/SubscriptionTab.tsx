import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { adminService } from "../../../services/admin";
import { planService, Plan } from "../../../services/plan";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa";
import type { ExtendedUserDetails } from "../../../types/admin";

interface SubscriptionTabProps {
  user: ExtendedUserDetails;
}

const formatDate = (iso?: string): string => {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
};

const SubscriptionTab: React.FC<SubscriptionTabProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planName, setPlanName] = useState("Go");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [refundingId, setRefundingId] = useState<string | null>(null);
  const [refundedIds, setRefundedIds] = useState<Set<string>>(new Set());

  const handleRefund = async (transactionId: string) => {
    if (!window.confirm("Issue a real Stripe refund for this transaction? This cannot be undone.")) return;
    setRefundingId(transactionId);
    try {
      const res = await adminService.issueRefund(transactionId);
      if (res.success) {
        toast.success(res.message || "Refund issued.");
        setRefundedIds((prev) => new Set(prev).add(transactionId));
      } else {
        toast.error(res.message || "Failed to issue refund.");
      }
    } finally {
      setRefundingId(null);
    }
  };

  useEffect(() => {
    planService.getAllPlans().then((res) => {
      if (res.success && res.data) {
        setPlans(res.data.filter((p: Plan) => p.key !== "free"));
      }
    }).catch(() => {});
  }, []);

  const handleAssignPlan = async () => {
    if (paymentStatus === "paid" && !invoiceNumber) {
      toast.error("Please enter an invoice number for paid status.");
      return;
    }
    setLoading(true);
    try {
      const res = await adminService.assignSubscription(user._id, {
        planName,
        billingCycle,
        paymentStatus,
        invoiceNumber: paymentStatus === "paid" ? invoiceNumber : undefined,
      });
      if (res.success) {
        toast.success(res.message || "Subscription updated correctly.");
        setIsEditing(false);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(res.message || "Failed to update subscription");
      }
    } catch (e: any) {
      toast.error("An error occurred during update");
    }
    setLoading(false);
  };

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
          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide ${
                /business|custom/i.test(user.subscription.plan || "")
                  ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                  : /pro/i.test(user.subscription.plan || "")
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : /go/i.test(user.subscription.plan || "")
                  ? "bg-green-600/20 text-green-400 border border-green-500/30"
                  : "bg-gray-600/20 text-gray-400 border border-gray-500/30"
              }`}
            >
              {user.subscription.plan}
            </span>
            <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-semibold transition whitespace-nowrap"
            >
                {isEditing ? 'Cancel Edit' : 'Update Plan'}
            </button>
          </div>
        </div>

        {isEditing && (
            <div className="mt-6 p-5 bg-[#2A2A2A] border border-[#333] rounded-lg">
                <h4 className="text-white font-semibold mb-4 text-base">Assign / Update Subscription</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                    <div>
                        <label className="block text-gray-400 mb-1.5">Select Plan</label>
                        <select
                            value={planName}
                            onChange={(e) => setPlanName(e.target.value)}
                            className="w-full bg-[#1A1A1A] text-white border border-[#333] rounded-md px-3 py-2 outline-none focus:border-red-500"
                        >
                            {plans.map((p) => (
                              <option key={p.key} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1.5">Billing Cycle</label>
                        <select 
                            value={billingCycle} 
                            onChange={(e) => setBillingCycle(e.target.value)}
                            className="w-full bg-[#1A1A1A] text-white border border-[#333] rounded-md px-3 py-2 outline-none focus:border-red-500"
                        >
                            <option value="monthly">Monthly</option>
                            <option value="annual">Annual</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-1.5">Payment Status</label>
                        <select 
                            value={paymentStatus} 
                            onChange={(e) => setPaymentStatus(e.target.value)}
                            className="w-full bg-[#1A1A1A] text-white border border-[#333] rounded-md px-3 py-2 outline-none focus:border-red-500"
                        >
                            <option value="paid">Paid (Activate immediately)</option>
                            <option value="unpaid">Unpaid (Email Payment Link)</option>
                        </select>
                    </div>
                    {paymentStatus === "paid" && (
                    <div>
                        <label className="block text-gray-400 mb-1.5">Invoice / Receipt # (Required)</label>
                        <input
                            type="text"
                            value={invoiceNumber}
                            onChange={(e) => setInvoiceNumber(e.target.value)}
                            placeholder="e.g. MANUAL-001 or pi_1234..."
                            className="w-full bg-[#1A1A1A] text-white border border-[#333] rounded-md px-3 py-2 outline-none focus:border-red-500"
                        />
                    </div>
                    )}
                </div>
                <div className="mt-5 flex justify-end">
                    <button
                        onClick={handleAssignPlan}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-md font-semibold transition disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (paymentStatus === 'paid' ? 'Confirm Assignment' : 'Generate & Send Link')}
                    </button>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
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
                {formatDate(user.subscription.nextBillingDate)}
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

          <div className="bg-[#2A2A2A] p-4 rounded-lg border border-[#333] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <FaMoneyBillWave />
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">
                Total Spent
              </p>
              <p className="text-white font-bold text-lg">
                ${user.transactions.filter(t => t.status === 'succeeded').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
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
                <th className="pb-3 text-gray-400 font-medium text-sm">
                  Actions
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
                    {formatDate(txn.date)}
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
                    {txn.invoiceUrl ? (
                      <a
                        href={txn.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-gray-600 text-sm cursor-not-allowed">
                        Download
                      </span>
                    )}
                  </td>
                  <td className="py-4">
                    {txn.status === "succeeded" && txn.description !== "refund" && !refundedIds.has(txn.id) ? (
                      <button
                        onClick={() => handleRefund(txn.id)}
                        disabled={refundingId === txn.id}
                        className="text-red-400 hover:text-red-300 text-sm font-medium disabled:opacity-50"
                      >
                        {refundingId === txn.id ? "Refunding…" : "Refund"}
                      </button>
                    ) : refundedIds.has(txn.id) ? (
                      <span className="text-gray-500 text-sm">Refunded</span>
                    ) : (
                      <span className="text-gray-600 text-sm">—</span>
                    )}
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
