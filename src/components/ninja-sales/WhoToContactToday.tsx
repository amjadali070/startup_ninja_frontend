import { type FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSun, FiLoader } from "react-icons/fi";
import { ninjaSalesService } from "../../services/ninjaSales";
import type { ContactTodayItem } from "../../services/ninjaSales";

function initialsFromName(name: string): string {
  const t = name?.trim();
  if (!t) return "?";
  const parts = t.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return t.slice(0, 2).toUpperCase();
}

const tierStyle: Record<string, string> = {
  Hot: "bg-red-600/20 text-red-500",
  Warm: "bg-orange-500/15 text-orange-400",
  Cold: "bg-white/10 text-white/40",
};

const WhoToContactToday: FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ContactTodayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const res = await ninjaSalesService.postContactToday();
      if (cancelled) return;
      if (res.success) setItems(res.data.items || []);
      else setError(res.message || "Could not load today's contacts");
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-2xl p-4 sm:p-6 h-full font-plus-jakarta flex flex-col gap-4 shadow-2xl overflow-hidden">
      <div className="flex items-center gap-2 mb-2 flex-shrink-0">
        <FiSun className="text-[#EF4444] w-5 h-5 flex-shrink-0" />
        <h2 className="text-base sm:text-lg font-semibold text-white tracking-wide leading-tight">
          Who to Contact Today
        </h2>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-12 text-white/40">
          <FiLoader className="w-5 h-5 animate-spin" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Loading</span>
        </div>
      )}

      {!loading && error && <p className="text-xs text-white/40 py-6 text-center">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="text-xs text-white/35 py-6 text-center">No hot leads need attention right now.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="flex flex-col gap-3 min-w-0">
          {items.map((item) => (
            <button
              key={item.leadId}
              type="button"
              onClick={() => navigate(`/ai-tools/sales/leads/${item.leadId}`)}
              className="flex items-center gap-3 p-3 sm:p-4 bg-white/[0.03] border border-white/[0.04] rounded-2xl hover:border-[#EF444430] transition-all group/card min-w-0 text-left"
            >
              <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/10 bg-gradient-to-br from-red-500/15 to-red-900/20 flex items-center justify-center text-red-500 font-black text-xs" aria-hidden>
                {initialsFromName(item.name)}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-white truncate group-hover/card:text-[#EF4444] transition-colors">
                    {item.name}{item.company ? <span className="text-white/35 font-bold"> · {item.company}</span> : null}
                  </h4>
                  <span className={`shrink-0 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${tierStyle[item.tier]}`}>{item.tier}</span>
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate mt-0.5">{item.reason}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default WhoToContactToday;
