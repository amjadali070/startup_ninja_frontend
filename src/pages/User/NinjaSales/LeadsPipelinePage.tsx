import { type FC, useState, useMemo } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import PipelineKanban, { Column } from "../../../components/ninja-sales/PipelineKanban";
import SalesStatGrid, { StatItem } from "../../../components/ninja-sales/SalesStatGrid";
import { FiPlus, FiFilter, FiCalendar, FiUser, FiChevronDown, FiTrendingUp, FiAlertTriangle, FiDollarSign, FiGlobe } from "react-icons/fi";
import { DropResult } from "@hello-pangea/dnd";

const initialKanbanData: Column[] = [
  {
    id: "new",
    title: "New Lead",
    cards: [
      { id: "1", company: "Aether Dynamics", contact: "Sarah Jenkins", value: "$125k", priority: "HIGH", date: "Dec 12", avatar: "https://i.pravatar.cc/150?u=sarah", lastActivity: "2h ago" },
      { id: "2", company: "Lumina Systems", contact: "Mark Thompson", value: "$42k", priority: "MED", date: "Dec 18", avatar: "https://i.pravatar.cc/150?u=mark" }
    ]
  },
  {
    id: "qualified",
    title: "Qualified",
    cards: [
      { id: "3", company: "Nebula Labs", contact: "Alex Rivera", value: "$280k", priority: "HIGH", date: "Jan 05", avatar: "https://i.pravatar.cc/150?u=alex", nextStep: "Next: Demo Wed" }
    ]
  },
  {
    id: "discovery",
    title: "Discovery",
    cards: [
      { id: "4", company: "Vertex Corp", contact: "Daria V.", value: "$18k", priority: "LOW", date: "Dec 15", avatar: "https://i.pravatar.cc/150?u=daria" }
    ]
  },
  {
    id: "proposal",
    title: "Proposal Sent",
    cards: [
      { id: "5", company: "Solaris Tech", contact: "Elena G.", value: "$150k", priority: "MED", date: "Dec 20", avatar: "https://i.pravatar.cc/150?u=elena" }
    ]
  },
  {
    id: "negotiation",
    title: "Negotiation",
    cards: [
      { id: "6", company: "Cyberdyne Sys", contact: "John C.", value: "$520k", priority: "HIGH", date: "Dec 22", avatar: "https://i.pravatar.cc/150?u=john", lastActivity: "1h ago" }
    ]
  }
];

const LeadsPipelinePage: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [kanbanData, setKanbanData] = useState<Column[]>(initialKanbanData);

  // Filter States
  const [timeframe, setTimeframe] = useState("This Quarter");
  const [owner, setOwner] = useState("All Owners");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [valueRange, setValueRange] = useState("All Values");
  const [leadSource, setLeadSource] = useState("All Sources");

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Sales logout failed:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const handleOpenSettings = () => {
    navigate("/settings");
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newCols = [...kanbanData];
    const sourceColIndex = newCols.findIndex(col => col.id === source.droppableId);
    const destColIndex = newCols.findIndex(col => col.id === destination.droppableId);

    // We deep clone the involved columns to ensure React detects the state change
    const sourceCol = { ...newCols[sourceColIndex], cards: [...newCols[sourceColIndex].cards] };
    const destCol = { ...newCols[destColIndex], cards: [...newCols[destColIndex].cards] };

    const [movedCard] = sourceCol.cards.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceCol.cards.splice(destination.index, 0, movedCard);
      newCols[sourceColIndex] = sourceCol;
    } else {
      destCol.cards.splice(destination.index, 0, movedCard);
      newCols[sourceColIndex] = sourceCol;
      newCols[destColIndex] = destCol;
    }
    setKanbanData(newCols);
  };

  const filteredColumns = useMemo(() => {
    return kanbanData.map(col => ({
      ...col,
      cards: col.cards.filter(card => {
        const priorityMatch = priorityFilter === "All Priority" || card.priority === priorityFilter.replace(" Priority", "").toUpperCase();

        // Mocking Value filtering logic based on string "$125k" -> 125000
        const numericValue = parseInt(card.value.replace(/[^0-9]/g, '')) * (card.value.includes('k') ? 1000 : 1);
        let valueMatch = true;
        if (valueRange === "< $50k") valueMatch = numericValue < 50000;
        else if (valueRange === "$50k - $200k") valueMatch = numericValue >= 50000 && numericValue <= 200000;
        else if (valueRange === "> $200k") valueMatch = numericValue > 200000;

        return priorityMatch && valueMatch;
      })
    }));
  }, [kanbanData, priorityFilter, valueRange]);

  const stats: StatItem[] = [
    { label: "Total Pipeline Value", value: "$4.8M", icon: <FiTrendingUp className="w-5 h-5" />, isPositive: true, change: "+12.5% this month" },
    { label: "Deals Closing (Month)", value: "12", icon: <FiTrendingUp className="w-5 h-5" />, isPositive: true, change: "+3 since last week" },
    { label: "Weighted Forecast", value: "$3.2M", icon: <FiTrendingUp className="w-5 h-5" />, isPositive: true, change: "On Track" },
    { label: "Stalled Deals", value: "03", warning: true, icon: <FiAlertTriangle className="w-5 h-5" />, change: "Requires Attention" },
  ];

  return (
    <DashboardLayout
      activePath="/ai-tools/sales/pipeline"
      title="Leads Pipeline - Ninja Sales"
      onLogout={handleLogout}
      onSettings={handleOpenSettings}
    >
      <main className="flex-1 overflow-y-auto font-plus-jakarta bg-[#07070C] min-h-screen">
        <div className="p-4 lg:p-8 space-y-8 max-w-auto mx-auto text-white pb-20">

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight uppercase">Lead Pipeline</h1>
              <p className="text-white/40 text-sm mt-1">Revenue Pipeline Overview</p>
            </div>
            <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 px-6 text-sm font-black transition-all shadow-lg shadow-red-600/20 active:scale-95 whitespace-nowrap">
              <FiPlus className="w-5 h-5" />
              <span>Add Lead</span>
            </button>
          </div>

          <SalesStatGrid stats={stats} />

          {/* Filtering Controls */}
          <div className="flex flex-wrap items-center gap-4 py-6 border-b border-white/[0.03]">
            {/* Timeframe Filter */}
            <div className="relative group">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="appearance-none flex items-center gap-2 bg-[#121212]/50 border border-white/10 hover:border-red-500/20 rounded-xl pl-10 pr-10 py-2.5 text-xs font-bold transition-all text-white/70 outline-none cursor-pointer w-full sm:w-auto hover:bg-white/[0.03]"
              >
                <option value="This Quarter" className="bg-[#121212]">This Quarter</option>
                <option value="This Month" className="bg-[#121212]">This Month</option>
                <option value="Last Quarter" className="bg-[#121212]">Last Quarter</option>
              </select>
              <FiCalendar className="w-4 h-4 text-white/30 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <FiChevronDown className="w-4 h-4 text-white/20 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Owner Filter */}
            <div className="relative group">
              <select
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="appearance-none flex items-center gap-2 bg-[#121212]/50 border border-white/10 hover:border-red-500/20 rounded-xl pl-10 pr-10 py-2.5 text-xs font-bold transition-all text-white/70 outline-none cursor-pointer w-full sm:w-auto hover:bg-white/[0.03]"
              >
                <option value="All Owners" className="bg-[#121212]">All Owners</option>
                <option value="Me" className="bg-[#121212]">Me Only</option>
              </select>
              <FiUser className="w-4 h-4 text-white/30 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <FiChevronDown className="w-4 h-4 text-white/20 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Priority Filter */}
            <div className="relative group">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="appearance-none flex items-center gap-2 bg-[#121212]/50 border border-white/10 hover:border-red-500/20 rounded-xl pl-10 pr-10 py-2.5 text-xs font-bold transition-all text-white/70 outline-none cursor-pointer w-full sm:w-auto hover:bg-white/[0.03]"
              >
                <option value="All Priority" className="bg-[#121212]">All Priority</option>
                <option value="High Priority" className="bg-[#121212]">High Priority</option>
                <option value="Med Priority" className="bg-[#121212]">Med Priority</option>
                <option value="Low Priority" className="bg-[#121212]">Low Priority</option>
              </select>
              <span className="text-red-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none font-bold">!</span>
              <FiChevronDown className="w-4 h-4 text-white/20 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Value Filter */}
            <div className="relative group">
              <select
                value={valueRange}
                onChange={(e) => setValueRange(e.target.value)}
                className="appearance-none flex items-center gap-2 bg-[#121212]/50 border border-white/10 hover:border-red-500/20 rounded-xl pl-10 pr-10 py-2.5 text-xs font-bold transition-all text-white/70 outline-none cursor-pointer w-full sm:w-auto hover:bg-white/[0.03]"
              >
                <option value="All Values" className="bg-[#121212]">All Values</option>
                <option value="< $50k" className="bg-[#121212]">&lt; $50k</option>
                <option value="$50k - $200k" className="bg-[#121212]">$50k - $200k</option>
                <option value="> $200k" className="bg-[#121212]">&gt; $200k</option>
              </select>
              <FiDollarSign className="w-4 h-4 text-white/30 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <FiChevronDown className="w-4 h-4 text-white/20 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Source Filter */}
            <div className="relative group">
              <select
                value={leadSource}
                onChange={(e) => setLeadSource(e.target.value)}
                className="appearance-none flex items-center gap-2 bg-[#121212]/50 border border-white/10 hover:border-red-500/20 rounded-xl pl-10 pr-10 py-2.5 text-xs font-bold transition-all text-white/70 outline-none cursor-pointer w-full sm:w-auto hover:bg-white/[0.03]"
              >
                <option value="All Sources" className="bg-[#121212]">All Sources</option>
                <option value="Referral" className="bg-[#121212]">Referral</option>
                <option value="Cold Outreach" className="bg-[#121212]">Cold Outreach</option>
                <option value="LinkedIn" className="bg-[#121212]">LinkedIn</option>
                <option value="Direct" className="bg-[#121212]">Direct</option>
              </select>
              <FiGlobe className="w-4 h-4 text-white/30 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <FiChevronDown className="w-4 h-4 text-white/20 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="w-[1px] h-6 bg-white/10 mx-2 hidden xl:block" />
            <button className="flex items-center gap-2 text-white/40 hover:text-white transition-all text-sm font-bold ml-auto xl:ml-0">
              <FiFilter className="w-4 h-4" />
              <span>More Filters</span>
            </button>
          </div>

          {/* Pipeline Kanban Section */}
          <div className="mt-8 pt-4 overflow-hidden">
            <PipelineKanban columns={filteredColumns} onDragEnd={onDragEnd} />
          </div>

        </div>
      </main>
    </DashboardLayout>
  );
};

export default LeadsPipelinePage;
