import { type FC, useEffect, useRef, useState } from 'react';
import { FiX, FiUpload, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { studentVerificationService, StudentVerificationStatus } from '../../services/studentVerification';

interface StudentVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void; // called once status is approved and user should proceed to purchase
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const StudentVerificationModal: FC<StudentVerificationModalProps> = ({ isOpen, onClose, onVerified }) => {
  const [status, setStatus] = useState<StudentVerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [universityName, setUniversityName] = useState('');
  const [universityEmail, setUniversityEmail] = useState('');
  const [studentIdNumber, setStudentIdNumber] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    studentVerificationService.getMyStatus().then((res) => {
      if (res.success) {
        setStatus(res.data);
        // Pre-fill from a prior submission (e.g. resubmitting after a
        // rejection) so the student doesn't have to retype everything.
        setUniversityName(res.data.universityName || '');
        setUniversityEmail(res.data.universityEmail || '');
        setStudentIdNumber(res.data.studentIdNumber || '');
        if (res.data.status === 'approved') {
          onVerified();
        }
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB.');
      return;
    }
    setSelectedFile(file);
  };

  const canSubmit =
    !!selectedFile &&
    universityName.trim().length > 0 &&
    studentIdNumber.trim().length > 0 &&
    EMAIL_RE.test(universityEmail.trim());

  const handleSubmit = async () => {
    if (!selectedFile) return;
    if (!universityName.trim() || !studentIdNumber.trim()) {
      toast.error('University name and student ID number are required.');
      return;
    }
    if (!EMAIL_RE.test(universityEmail.trim())) {
      toast.error('Enter a valid university email address.');
      return;
    }
    setSubmitting(true);
    const loadingId = toast.loading('Uploading your ID...');
    try {
      const res = await studentVerificationService.submitVerification(selectedFile, {
        universityName: universityName.trim(),
        universityEmail: universityEmail.trim(),
        studentIdNumber: studentIdNumber.trim(),
      });
      if (res.success) {
        toast.success(res.message || 'Submitted for review.', { id: loadingId });
        setStatus({ status: 'pending' });
        setSelectedFile(null);
      } else {
        toast.error(res.message || 'Failed to submit', { id: loadingId });
      }
    } catch (e) {
      toast.error('An error occurred', { id: loadingId });
    } finally {
      setSubmitting(false);
    }
  };

  const renderBody = () => {
    if (loading) {
      return <div className="py-10 text-center text-white/50 text-sm">Checking status…</div>;
    }

    if (status?.status === 'pending') {
      return (
        <div className="flex flex-col items-center text-center py-6">
          <div className="h-14 w-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
            <FiClock className="h-6 w-6" />
          </div>
          <h3 className="text-white text-base font-semibold">Verification pending</h3>
          <p className="text-white/50 text-sm mt-1.5 max-w-sm">
            Your student ID is under review. This usually takes 1-2 business days — we'll let you know once it's approved.
          </p>
        </div>
      );
    }

    if (status?.status === 'rejected') {
      return (
        <div className="flex flex-col items-center text-center py-6">
          <div className="h-14 w-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
            <FiXCircle className="h-6 w-6" />
          </div>
          <h3 className="text-white text-base font-semibold">Verification not approved</h3>
          <p className="text-white/50 text-sm mt-1.5 max-w-sm mb-5">
            {status.rejectionReason || "We couldn't verify this as a valid student ID."} You can submit a new photo below.
          </p>
          {renderUploadForm()}
        </div>
      );
    }

    // 'none' or 'expired'
    return (
      <div className="py-2">
        {status?.status === 'expired' && (
          <div className="flex items-center gap-2 text-amber-400 text-sm mb-4 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
            <FiClock className="h-4 w-4 flex-shrink-0" />
            Your previous verification has expired — please re-verify to keep the Go Student price.
          </div>
        )}
        <p className="text-white/60 text-sm mb-5">
          Tell us your school and student ID, then upload a photo of your current student ID card (or another
          document showing you're currently enrolled). An admin will review it — this usually takes 1-2 business
          days.
        </p>
        {renderUploadForm()}
      </div>
    );
  };

  const renderUploadForm = () => (
    <>
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-white/60 mb-1.5">
            University / School Name
          </label>
          <input
            type="text"
            value={universityName}
            onChange={(e) => setUniversityName(e.target.value)}
            placeholder="e.g. University of Toronto"
            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-500/50"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/60 mb-1.5">
            University Email
          </label>
          <input
            type="email"
            value={universityEmail}
            onChange={(e) => setUniversityEmail(e.target.value)}
            placeholder="you@university.edu"
            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-500/50"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/60 mb-1.5">
            Student ID Number
          </label>
          <input
            type="text"
            value={studentIdNumber}
            onChange={(e) => setStudentIdNumber(e.target.value)}
            placeholder="e.g. 100948213"
            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-500/50"
          />
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {previewUrl ? (
        <div className="mb-4">
          <img src={previewUrl} alt="Selected ID preview" className="w-full max-h-56 object-contain rounded-lg border border-white/10 bg-black/30" />
          <button
            type="button"
            onClick={() => setSelectedFile(null)}
            className="mt-2 text-xs text-white/50 hover:text-white underline"
          >
            Choose a different image
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-2 py-8 rounded-lg border-2 border-dashed border-white/15 hover:border-white/30 text-white/50 hover:text-white/70 transition-colors mb-4"
        >
          <FiUpload className="h-5 w-5" />
          <span className="text-sm">Click to upload a photo of your ID</span>
          <span className="text-xs text-white/30">JPG or PNG, up to 5MB</span>
        </button>
      )}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit || submitting}
        className="w-full py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2"
      >
        {submitting ? 'Submitting…' : 'Submit for Review'}
      </button>
    </>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#0B0B0F]/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
                <FiCheckCircle className="h-5 w-5" />
              </div>
              <h2 className="text-white text-lg font-semibold">Student Verification</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
              aria-label="Close modal"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">{renderBody()}</div>
        </div>
      </div>
    </>
  );
};

export default StudentVerificationModal;
