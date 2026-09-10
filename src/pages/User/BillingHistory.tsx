import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiCheck, FiClock, FiDollarSign, FiCreditCard, FiCalendar } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { subscriptionService } from '../../services/subscription';
import { useAuth } from '../../hooks/useAuth';

interface BillingRecord {
  _id: string;
  createdAt: string;
  planDetails: {
    planName: string;
    billingCycle: string;
    previousPlan?: string;
  };
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  invoiceNumber?: string;
  invoiceUrl?: string;
  transactionType: string;
  paymentMethod?: {
    last4: string;
    brand: string;
  };
}

const BillingHistory: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [transactions, setTransactions] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<BillingRecord | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await subscriptionService.getTransactionHistory({ limit: 50 });
      if (response.success && response.transactions) {
        setTransactions(response.transactions);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of helper functions

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-500/10 text-green-500 border-green-500/20',
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      failed: 'bg-red-500/10 text-red-500 border-red-500/20',
      refunded: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    };

    const displayText = status === 'completed' ? 'Paid' : status.charAt(0).toUpperCase() + status.slice(1);

    return (
      <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${styles[status as keyof typeof styles] || styles.pending}`}>
        {displayText}
      </span>
    );
  };

  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      subscription_purchase: 'New Subscription',
      subscription_upgrade: 'Plan Upgrade',
      subscription_downgrade: 'Plan Downgrade',
      subscription_renewal: 'Renewal',
      refund: 'Refund'
    };
    return labels[type] || type;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate statistics
  const stats = {
    total: transactions.length,
    totalSpent: transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    lastPayment: transactions.find(t => t.status === 'completed'),
    pending: transactions.filter(t => t.status === 'pending').length
  };

  return (
    <DashboardLayout
      title="Billing History"
      activePath="/billing-history"
      onLogout={handleLogout}
    >
      <div className="min-h-screen bg-black p-4 sm:p-6 lg:p-8">
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <FiArrowLeft size={20} />
              <span>Back to Settings</span>
            </button>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Billing History</h1>
                <p className="text-gray-400">View and manage your payment history and invoices</p>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-[#151515] to-[#0a0a0a] border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <FiClock className="text-blue-500" size={20} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Transactions</p>
                  <p className="text-white text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#151515] to-[#0a0a0a] border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <FiDollarSign className="text-green-500" size={20} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Spent</p>
                  <p className="text-white text-2xl font-bold">${stats.totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#151515] to-[#0a0a0a] border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <FiClock className="text-yellow-500" size={20} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Pending</p>
                  <p className="text-white text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#151515] to-[#0a0a0a] border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <FiCalendar className="text-purple-500" size={20} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Last Payment</p>
                  <p className="text-white text-lg font-bold">
                    {stats.lastPayment ? `$${stats.lastPayment.amount.toFixed(2)}` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-gradient-to-br from-[#151515] to-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">All Transactions</h2>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-16">
                <FiCreditCard className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400 mb-2">No billing history found</p>
                <p className="text-gray-500 text-sm">Your payment history will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {transactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="p-6 hover:bg-white/5 transition-all cursor-pointer"
                    onClick={() => setSelectedTransaction(transaction)}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                          <FiCheck className="text-green-500" size={20} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-white font-semibold text-lg">
                              {transaction.planDetails.planName} Plan
                            </h3>
                            <span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded border border-blue-500/20">
                              {getTransactionTypeLabel(transaction.transactionType)}
                            </span>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-gray-400 text-sm flex items-center gap-2">
                              <FiCalendar size={14} />
                              {formatDate(transaction.createdAt)}
                            </p>
                            
                            {transaction.invoiceNumber && (
                              <p className="text-gray-500 text-xs">
                                Invoice: {transaction.invoiceNumber}
                              </p>
                            )}
                            
                            {transaction.paymentMethod && (
                              <p className="text-gray-500 text-xs flex items-center gap-1">
                                <FiCreditCard size={12} />
                                {transaction.paymentMethod.brand} •••• {transaction.paymentMethod.last4}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex items-center gap-4 lg:flex-shrink-0">
                        <div className="text-right">
                          <div className="text-white font-bold text-2xl mb-1">
                            ${transaction.amount.toFixed(2)}
                          </div>
                          {getStatusBadge(transaction.status)}
                        </div>

                        {transaction.invoiceUrl && transaction.status === 'completed' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(transaction.invoiceUrl, '_blank');
                            }}
                            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
                            title="Download Invoice"
                          >
                            <FiDownload className="text-white" size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transaction Details Modal */}
          {selectedTransaction && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-2xl bg-gradient-to-br from-[#0a0a0a] to-black rounded-2xl p-6 lg:p-8 border border-white/10 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Transaction Details</h2>
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Amount */}
                  <div className="text-center py-6 border-b border-white/10">
                    <p className="text-gray-400 text-sm mb-2">Amount Paid</p>
                    <p className="text-white text-4xl font-bold">${selectedTransaction.amount.toFixed(2)}</p>
                    <div className="mt-3">{getStatusBadge(selectedTransaction.status)}</div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Plan</p>
                      <p className="text-white font-medium">{selectedTransaction.planDetails.planName}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Billing Cycle</p>
                      <p className="text-white font-medium capitalize">{selectedTransaction.planDetails.billingCycle}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Transaction Type</p>
                      <p className="text-white font-medium">{getTransactionTypeLabel(selectedTransaction.transactionType)}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Date</p>
                      <p className="text-white font-medium">
                        {formatDate(selectedTransaction.createdAt)}
                      </p>
                    </div>
                    
                    {selectedTransaction.invoiceNumber && (
                      <div className="col-span-2">
                        <p className="text-gray-500 text-sm mb-1">Invoice Number</p>
                        <p className="text-white font-medium">{selectedTransaction.invoiceNumber}</p>
                      </div>
                    )}
                    
                    {selectedTransaction.paymentMethod && (
                      <div className="col-span-2">
                        <p className="text-gray-500 text-sm mb-1">Payment Method</p>
                        <p className="text-white font-medium">
                          {selectedTransaction.paymentMethod.brand} •••• {selectedTransaction.paymentMethod.last4}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Download Invoice */}
                  {selectedTransaction.invoiceUrl && selectedTransaction.status === 'completed' && (
                    <button
                      onClick={() => window.open(selectedTransaction.invoiceUrl, '_blank')}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <FiDownload />
                      Download Invoice
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Need help with billing? <a href="/contact" className="text-red-500 hover:text-red-400">Contact support</a>
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BillingHistory;
