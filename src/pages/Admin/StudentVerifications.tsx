import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth';
import AlertModal from '../../components/AlertModal';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiCheck, FiX, FiUser, FiMail } from 'react-icons/fi';
import {
  studentVerificationService,
  StudentVerificationSubmission,
} from '../../services/studentVerification';

const STATUS_TABS: { key: string; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'all', label: 'All' },
];

const formatDate = (iso?: string): string => {
  if (!iso) return '-';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '-' : d.toLocaleDateString();
};

const VerificationImage: React.FC<{ id: string }> = ({ id }) => {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;
    studentVerificationService.getVerificationImageBlob(id).then((blob) => {
      if (cancelled) return;
      if (!blob) {
        setFailed(true);
        return;
      }
      objectUrl = URL.createObjectURL(blob);
      setSrc(objectUrl);
    });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id]);

  if (failed) {
    return <div className="text-white/40 text-xs italic">Image no longer available (already reviewed).</div>;
  }
  if (!src) {
    return <div className="h-40 flex items-center justify-center"><LoadingSpinner size="small" /></div>;
  }
  return (
    <img
      src={src}
      alt="Submitted student ID"
      className="max-h-64 w-auto rounded-lg border border-white/10 bg-black/30 object-contain"
    />
  );
};

const StudentVerifications: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [submissions, setSubmissions] = useState<StudentVerificationSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await studentVerificationService.listVerifications(activeTab);
    if (res.success) {
      setSubmissions(res.data || []);
    } else {
      toast.error(res.message || 'Failed to load verifications');
    }
    setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await studentVerificationService.approveVerification(id);
      if (res.success) {
        toast.success('Verification approved');
        setSubmissions((prev) => prev.filter((s) => s._id !== id));
      } else {
        toast.error(res.message || 'Failed to approve');
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectTargetId) return;
    setProcessingId(rejectTargetId);
    try {
      const res = await studentVerificationService.rejectVerification(rejectTargetId, rejectReason || undefined);
      if (res.success) {
        toast.success('Verification rejected');
        setSubmissions((prev) => prev.filter((s) => s._id !== rejectTargetId));
      } else {
        toast.error(res.message || 'Failed to reject');
      }
    } finally {
      setProcessingId(null);
      setRejectTargetId(null);
      setRejectReason('');
    }
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
    <DashboardLayout activePath="/admin-dashboard/student-verifications" title="Student Verifications" onLogout={handleLogout}>
      <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-white text-xl sm:text-2xl font-bold font-plus-jakarta mb-1">
            Student ID Verifications
          </h1>
          <p className="text-gray-400 text-sm">
            Review submissions for the Go Student discounted price. Uploaded ID images are deleted immediately
            after a decision is made.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 border-b border-white/10">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-red-500 text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : submissions.length === 0 ? (
          <EmptyState
            title="Nothing here"
            description={`No ${activeTab === 'all' ? '' : activeTab} verification submissions found.`}
          />
        ) : (
          <div className="space-y-3">
            {submissions.map((s) => {
              const isExpanded = expandedId === s._id;
              return (
                <div key={s._id} className="rounded-xl border border-white/10 bg-[#151515] p-4">
                  <div
                    className="flex items-center justify-between gap-3 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : s._id)}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-white text-sm font-semibold truncate">
                        <FiUser className="h-3.5 w-3.5 text-white/40 flex-shrink-0" />
                        {s.userId?.fullname || s.userId?.username || 'Unknown user'}
                      </div>
                      <div className="flex items-center gap-2 text-white/40 text-xs mt-0.5 truncate">
                        <FiMail className="h-3 w-3 flex-shrink-0" />
                        {s.userId?.email}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded border capitalize ${
                          s.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : s.status === 'rejected'
                            ? 'bg-red-500/10 text-red-400 border-red-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {s.status}
                      </span>
                      <span className="text-white/30 text-xs hidden sm:inline">
                        {formatDate(s.submittedAt)}
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      {s.status === 'pending' ? (
                        <VerificationImage id={s._id} />
                      ) : (
                        <p className="text-white/40 text-xs italic mb-2">
                          Image was deleted after this submission was reviewed.
                        </p>
                      )}
                      {s.rejectionReason && (
                        <p className="text-red-400 text-xs mt-2">Reason: {s.rejectionReason}</p>
                      )}
                      {s.status === 'pending' && (
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleApprove(s._id); }}
                            disabled={processingId === s._id}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            <FiCheck className="h-4 w-4" /> Approve
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setRejectTargetId(s._id); }}
                            disabled={processingId === s._id}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            <FiX className="h-4 w-4" /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AlertModal
        isOpen={!!rejectTargetId}
        type="danger"
        action="custom"
        title="Reject verification?"
        message={
          <div className="space-y-3">
            <p className="text-white/80 text-sm">This will delete the uploaded ID image and notify nothing automatically — the user can resubmit.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason (optional, shown to the user)"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-red-500/50"
              rows={3}
            />
          </div>
        }
        confirmText="Reject"
        cancelText="Cancel"
        onClose={() => { setRejectTargetId(null); setRejectReason(''); }}
        onConfirm={handleConfirmReject}
        isLoading={!!processingId}
        loadingText="Rejecting..."
      />
    </DashboardLayout>
  );
};

export default StudentVerifications;
