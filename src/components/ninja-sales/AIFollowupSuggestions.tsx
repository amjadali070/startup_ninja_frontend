import { type FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiZap } from "react-icons/fi";
import { ninjaSalesService } from "../../services/ninjaSales";
import type { FollowUpSuggestionItem } from "../../services/ninjaSales";
import LoadingSpinner from "../LoadingSpinner";

function initialsFromName(name: string): string {
  const t = name?.trim();
  if (!t) return "?";
  const parts = t.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return t.slice(0, 2).toUpperCase();
}

const AIFollowupSuggestions: FC = () => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<FollowUpSuggestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const res = await ninjaSalesService.postFollowUpSuggestions();
      if (cancelled) return;
      if (res.success && res.data?.suggestions) setSuggestions(res.data.suggestions);
      else setError(res.message || "Could not load suggestions");
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-2xl p-4 sm:p-6 h-full font-plus-jakarta flex flex-col gap-4 shadow-2xl overflow-hidden">
      <div className="flex items-center gap-2 mb-2 flex-shrink-0">
        <FiZap className="text-[#EF4444] w-5 h-5 flex-shrink-0 animate-pulse" />
        <h2 className="text-base sm:text-lg font-semibold text-white tracking-wide leading-tight">
          AI Follow-up Suggestions
        </h2>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="small" />
        </div>
      )}

      {!loading && error && (
        <p className="text-xs text-white/40 py-6 text-center">{error}</p>
      )}

      {!loading && !error && suggestions.length === 0 && (
        <p className="text-xs text-white/35 py-6 text-center">No open follow-ups to prioritize.</p>
      )}

      {!loading && !error && suggestions.length > 0 && (
        <div className="flex flex-col gap-4 sm:gap-4 min-w-0">
          {suggestions.map((sug) => (
            <div
              key={sug.followUpId}
              className="flex items-center gap-3 p-3 sm:p-5 bg-white/[0.03] border border-white/[0.04] rounded-2xl hover:border-[#EF444430] transition-all group/card min-w-0"
            >
              <div
                className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/10 bg-gradient-to-br from-red-500/15 to-red-900/20 flex items-center justify-center text-red-500 font-black text-xs sm:text-sm"
                aria-hidden
              >
                {initialsFromName(sug.name)}
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <h4 className="text-sm font-black text-white truncate group-hover/card:text-[#EF4444] transition-colors">
                  {sug.name}
                  {sug.company ? (
                    <span className="text-white/35 font-bold"> · {sug.company}</span>
                  ) : null}
                </h4>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate mt-0.5">
                  {sug.detail}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/ai-tools/sales/follow-ups?draftFollowUp=${encodeURIComponent(sug.followUpId)}&draftProject=${encodeURIComponent(sug.projectId)}`
                  )
                }
                className="flex-shrink-0 px-3 sm:px-4 py-2.5 bg-[#E50000] hover:bg-[#CC0000] text-white rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 whitespace-nowrap"
              >
                Generate Email
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIFollowupSuggestions;
