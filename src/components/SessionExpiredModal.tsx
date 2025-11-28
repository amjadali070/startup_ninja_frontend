import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { IoWarningOutline } from "react-icons/io5";

const SessionExpiredModal: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionExpired = () => {
      setIsOpen(true);
    };

    window.addEventListener("session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, []);

  const handleLogin = () => {
    setIsOpen(false);
    navigate("/login");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#242424] bg-[#151515] p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <IoWarningOutline className="h-8 w-8" />
          </div>
          
          <h2 className="mb-2 text-xl font-bold text-white">Session Expired</h2>
          
          <p className="mb-6 text-white/60">
            Your session has expired due to inactivity. Please log in again to continue using Startup Ninja.
          </p>
          
          <button
            onClick={handleLogin}
            className="w-full rounded-xl bg-[#DE0500] py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Log In Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
