import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FiActivity,
  FiCalendar,
  FiFilter,
  FiLink,
  FiLoader,
  FiMail,
  FiMessageSquare,
  FiPhone,
  FiSearch,
  FiSend,
} from "react-icons/fi";
import IconSelect from "../IconSelect";
import { ninjaSalesService, type SalesActivity } from "../../services/ninjaSales";

interface ActivitiesTableProps {
  refreshKey?: number;
}

const TYPE_OPTIONS = [
  { value: "ALL", label: "All Types", icon: <FiFilter className="w-4 h-4" /> },
  { value: "CALL", label: "Call", icon: <FiPhone className="w-4 h-4" /> },
  { value: "EMAIL", label: "Email", icon: <FiMail className="w-4 h-4" /> },
  { value: "MEETING", label: "Meeting", icon: <FiCalendar className="w-4 h-4" /> },
  { value: "NOTE", label: "Note", icon: <FiMessageSquare className="w-4 h-4" /> },
  { value: "STAGE_CHANGE", label: "Stage Change", icon: <FiActivity className="w-4 h-4" /> },
  { value: "PROPOSAL", label: "Proposal", icon: <FiSend className="w-4 h-4" /> },
  { value: "TASK", label: "Task", icon: <FiActivity className="w-4 h-4" /> },
  { value: "OTHER", label: "Other", icon: <FiLink className="w-4 h-4" /> },
];

const TYPE_STYLES: Record<string, string> = {
  CALL: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  EMAIL: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
  MEETING: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  NOTE: "bg-rose-500/10 text-rose-300 border-rose-500/20",
  STAGE_CHANGE: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  PROPOSAL: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  TASK: "bg-pink-500/10 text-pink-300 border-pink-500/20",
  OTHER: "bg-slate-500/10 text-slate-300 border-slate-500/20",
};

const formatDateTime = (value?: string) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleString();
};

const ActivitiesTable: React.FC<ActivitiesTableProps> = ({ refreshKey }) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activities, setActivities] = useState<SalesActivity[]>([]);
  const [totalActivities, setTotalActivities] = useState(0);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const startDateInputRef = useRef<HTMLInputElement | null>(null);
  const endDateInputRef = useRef<HTMLInputElement | null>(null);

  const openDatePicker = (input: HTMLInputElement | null) => {
    if (!input) return;
    if ("showPicker" in input && typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }
    input.focus();
    input.click();
  };

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    const res = await ninjaSalesService.getActivities({
      page: currentPage,
      limit: itemsPerPage,
      search: search || undefined,
      type: typeFilter !== "ALL" ? typeFilter : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
    if (res.success) {
      setActivities(res.data);
      setTotalActivities(res.pagination?.total || res.data.length);
    } else {
      setActivities([]);
      setTotalActivities(0);
    }
    setLoading(false);
  }, [currentPage, search, typeFilter, startDate, endDate]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities, refreshKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(totalActivities / itemsPerPage));

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("ALL");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#121212] border border-white/[0.03] rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-4 sm:p-6 border-b border-white/[0.03] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 flex-1">
          <div className="relative group w-full md:w-[320px]">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-red-500 transition-colors" />
            <input
              type="text"
              placeholder="Search activities, leads, companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all w-full"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <IconSelect
              value={typeFilter}
              onChange={setTypeFilter}
              options={TYPE_OPTIONS}
              className="bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 rounded-xl px-4 py-0 flex-1 md:w-[180px] h-[46px] text-sm"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-[170px]">
              <input
                ref={startDateInputRef}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-4 pr-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all w-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-10"
              />
              <button
                type="button"
                onClick={() => openDatePicker(startDateInputRef.current)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-white/45 hover:text-white/70 hover:bg-white/10 transition-colors"
                aria-label="Open start date picker"
              >
                <FiCalendar className="w-4 h-4" />
              </button>
            </div>

            <div className="relative w-full md:w-[170px]">
              <input
                ref={endDateInputRef}
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-4 pr-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all w-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-10"
              />
              <button
                type="button"
                onClick={() => openDatePicker(endDateInputRef.current)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-white/45 hover:text-white/70 hover:bg-white/10 transition-colors"
                aria-label="Open end date picker"
              >
                <FiCalendar className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-auto">
          <button
            type="button"
            onClick={resetFilters}
            className="w-full lg:w-auto h-[46px] px-4 rounded-xl border border-white/10 text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-6 h-6 text-red-500 animate-spin" />
          <span className="ml-3 text-white/40 text-sm">Loading activities...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-white/[0.02] border-b border-white/[0.03]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-white/50 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-4 text-xs font-bold text-white/50 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-white/50 uppercase tracking-wider">Lead</th>
                <th className="px-6 py-4 text-xs font-bold text-white/50 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-bold text-white/50 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <p className="text-white/30 text-sm">No activities found matching your filters</p>
                  </td>
                </tr>
              ) : (
                activities.map((activity) => (
                  <tr
                    key={activity.id || activity._id}
                    className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors duration-200"
                  >
                    <td className="px-6 py-5">
                      <div className="text-sm font-semibold text-white/80">{activity.title || "Untitled activity"}</div>
                      <div className="text-[11px] text-white/40 mt-1">{activity.time || "—"}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full border text-[10px] font-semibold tracking-wide ${
                          TYPE_STYLES[activity.type] || "bg-white/10 text-white/70 border-white/20"
                        }`}
                      >
                        {activity.type?.replace("_", " ") || "OTHER"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-medium text-white/70">{activity.leadName || "Unknown"}</div>
                      <div className="text-xs text-white/40 mt-1">{activity.leadCompany || "—"}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-white/60 max-w-[360px] truncate">{activity.description || "—"}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-white/50">{formatDateTime(activity.createdAt)}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="p-4 sm:p-6 bg-white/[0.02] border-t border-white/[0.03] flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-xs text-white/30 font-medium order-2 md:order-1">
          Showing{" "}
          <span className="text-white/60">
            {totalActivities > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
            {Math.min(currentPage * itemsPerPage, totalActivities)}
          </span>{" "}
          of <span className="text-white/60">{totalActivities}</span> activities
        </p>
        <div className="flex items-center gap-2 order-1 md:order-2 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border border-white/[0.03] transition-all flex-1 md:flex-none ${
              currentPage === 1 ? "text-white/20 cursor-not-allowed" : "text-white/60 hover:bg-white/5 active:scale-95"
            }`}
          >
            Prev
          </button>

          <div className="flex items-center gap-6 px-3 py-1 bg-white/[0.02] border border-white/5 rounded-xl mx-1 md:mx-2">
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] whitespace-nowrap">
              Page <span className="text-white text-xs font-black">{currentPage}</span>
              <span className="text-white/10 mx-1">/</span>
              {totalPages}
            </span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-5 py-2 rounded-xl text-xs font-semibold border border-white/10 transition-all flex-1 md:flex-none ${
              currentPage === totalPages
                ? "text-white/20 cursor-not-allowed"
                : "text-white/60 bg-white/5 hover:bg-white/10 active:scale-95"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesTable;
