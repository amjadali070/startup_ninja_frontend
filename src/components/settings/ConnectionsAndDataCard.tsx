import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiExternalLink, FiDownload } from "react-icons/fi";
import { PiBrainLight } from "react-icons/pi";
import { FaGlobe, FaShareAlt } from "react-icons/fa";
import { userService } from "../../services/user";

const CONNECTIONS = [
  {
    icon: FaShareAlt,
    label: "Connected social accounts",
    description: "Manage Instagram/Facebook connections in Social Pro.",
    path: "/ai-tools/social-pro",
  },
  {
    icon: FaGlobe,
    label: "Connected domains",
    description: "Manage custom domains per website in Web Builder.",
    path: "/ai-tools/web-builder",
  },
  {
    icon: PiBrainLight,
    label: "Ninja Chat memory",
    description: "View and edit what Ninja Chat remembers about you.",
    path: "/ai-tools/chat/memories",
  },
];

const ConnectionsAndDataCard: FC = () => {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await userService.exportMyData();
      if (res.success) {
        toast.success("Your data export has started downloading.");
      } else {
        toast.error(res.message || "Failed to export data.");
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="rounded-xl border border-white/10 bg-[#151515] p-4 xs:p-5 sm:p-6">
      <h3 className="text-white text-lg xs:text-xl font-bold font-plus-jakarta mb-1">Connections & data</h3>
      <p className="text-gray-400 text-xs xs:text-sm mb-4">
        Quick links to where your connected accounts, domains, and memory actually live, plus a copy of your account data.
      </p>

      <div className="space-y-2 mb-4">
        {CONNECTIONS.map(({ icon: Icon, label, description, path }) => (
          <button
            key={path}
            type="button"
            onClick={() => navigate(path)}
            className="w-full flex items-center gap-3 rounded-lg border border-white/10 px-3 py-2.5 text-left transition-colors hover:bg-white/5"
          >
            <Icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium">{label}</div>
              <div className="text-gray-400 text-xs truncate">{description}</div>
            </div>
            <FiExternalLink className="h-4 w-4 text-gray-500 flex-shrink-0" />
          </button>
        ))}
      </div>

      <div className="border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiDownload className="h-4 w-4" />
          {isExporting ? "Preparing export…" : "Export my account data"}
        </button>
      </div>
    </section>
  );
};

export default ConnectionsAndDataCard;
