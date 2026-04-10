import { type FC, useState, useMemo } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import PipelineKanban, { Column } from "../../../components/ninja-sales/PipelineKanban";
import SalesStatGrid, { StatItem } from "../../../components/ninja-sales/SalesStatGrid";
import NinjaSalesHeader from "../../../components/ninja-sales/NinjaSalesHeader";
import { FiFilter, FiCalendar, FiUser, FiTrendingUp, FiAlertTriangle, FiDollarSign, FiGlobe, FiSearch } from "react-icons/fi";
import { DropResult } from "@hello-pangea/dnd";
import AddProjectModal from "../../../components/ninja-sales/AddProjectModal";
import IconSelect from "../../../components/IconSelect";

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter States
  const [timeframe, setTimeframe] = useState("This Quarter");
  const [owner, setOwner] = useState("All Owners");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [valueRange, setValueRange] = useState("All Values");
  const [leadSource, setLeadSource] = useState("All Sources");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleNewLead = () => {
    setIsAddModalOpen(true);
  };

  const handleExport = () => {
    console.log("Export CSV triggered");
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newCols = [...kanbanData];
    const sourceColIndex = newCols.findIndex(col => col.id === source.droppableId);
    const destColIndex = newCols.findIndex(col => col.id === destination.droppableId);

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

        const numericValue = parseInt(card.value.replace(/[^0-9]/g, '')) * (card.value.includes('k') ? 1000 : 1);
        let valueMatch = true;
        if (valueRange === "< $50k") valueMatch = numericValue < 50000;
        else if (valueRange === "$50k - $200k") valueMatch = numericValue >= 50000 && numericValue <= 200000;
        else if (valueRange === "> $200k") valueMatch = numericValue > 200000;

        const searchMatch = !searchQuery || card.company.toLowerCase().includes(searchQuery.toLowerCase()) || card.contact.toLowerCase().includes(searchQuery.toLowerCase());

        return priorityMatch && valueMatch && searchMatch;
      })
    }));
  }, [kanbanData, priorityFilter, valueRange, searchQuery]);

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

          <NinjaSalesHeader
            title="Lead Pipeline"
            subtitle="Revenue Pipeline Overview — Monitoring your business velocity."
            onNewDeal={handleNewLead}
            onExport={handleExport}
          />

          <SalesStatGrid stats={stats} />

          {/* Filtering Controls */}
          <div className="flex flex-wrap items-center gap-3 py-6 border-b border-white/[0.03] w-full">
            <IconSelect
              value={timeframe}
              onChange={setTimeframe}
              options={[
                { value: "This Quarter", label: "This Quarter", icon: <FiCalendar className="w-4 h-4" /> },
                { value: "This Month", label: "This Month", icon: <FiCalendar className="w-4 h-4" /> },
                { value: "Last Quarter", label: "Last Quarter", icon: <FiCalendar className="w-4 h-4" /> },
              ]}
              className="bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 rounded-xl px-4 py-0 flex-1 md:w-[160px] h-[46px] text-sm"
            />

            <IconSelect
              value={owner}
              onChange={setOwner}
              options={[
                { value: "All Owners", label: "All Owners", icon: <FiUser className="w-4 h-4" /> },
                { value: "Me", label: "Me Only", icon: <FiUser className="w-4 h-4" /> },
              ]}
              className="bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 rounded-xl px-4 py-0 flex-1 md:w-[160px] h-[46px] text-sm"
            />

            <IconSelect
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={[
                { value: "All Priority", label: "All Priority", icon: <FiAlertTriangle className="w-4 h-4" /> },
                { value: "High Priority", label: "High Priority", icon: <FiAlertTriangle className="w-4 h-4" /> },
                { value: "Med Priority", label: "Med Priority", icon: <FiAlertTriangle className="w-4 h-4" /> },
                { value: "Low Priority", label: "Low Priority", icon: <FiAlertTriangle className="w-4 h-4" /> },
              ]}
              className="bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 rounded-xl px-4 py-0 flex-1 md:w-[160px] h-[46px] text-sm"
            />

            <IconSelect
              value={valueRange}
              onChange={setValueRange}
              options={[
                { value: "All Values", label: "All Values", icon: <FiDollarSign className="w-4 h-4" /> },
                { value: "< $50k", label: "< $50k", icon: <FiDollarSign className="w-4 h-4" /> },
                { value: "$50k - $200k", label: "$50k - $200k", icon: <FiDollarSign className="w-4 h-4" /> },
                { value: "> $200k", label: "> $200k", icon: <FiDollarSign className="w-4 h-4" /> },
              ]}
              className="bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 rounded-xl px-4 py-0 flex-1 md:w-[160px] h-[46px] text-sm"
            />

            <IconSelect
              value={leadSource}
              onChange={setLeadSource}
              options={[
                { value: "All Sources", label: "All Sources", icon: <FiGlobe className="w-4 h-4" /> },
                { value: "Referral", label: "Referral", icon: <FiGlobe className="w-4 h-4" /> },
                { value: "Cold Outreach", label: "Cold Outreach", icon: <FiGlobe className="w-4 h-4" /> },
                { value: "LinkedIn", label: "LinkedIn", icon: <FiGlobe className="w-4 h-4" /> },
                { value: "Direct", label: "Direct", icon: <FiGlobe className="w-4 h-4" /> },
              ]}
              className="bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 rounded-xl px-4 py-0 flex-1 md:w-[160px] h-[46px] text-sm"
            />

            {showMoreFilters && (
              <div className="relative group w-full xl:w-[280px] animate-in fade-in zoom-in-95 ml-auto">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#1A1A1A] hover:bg-[#222222] border border-white/10 rounded-xl py-0 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all w-full h-[46px]"
                />
              </div>
            )}

            <div className={`w-[1px] h-6 bg-white/10 mx-2 hidden xl:block ${!showMoreFilters ? 'ml-auto' : ''}`} />
            <button 
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className={`flex items-center gap-2 transition-all text-sm font-bold ${!showMoreFilters ? 'ml-auto xl:ml-0' : 'xl:ml-0'} ${showMoreFilters ? 'text-red-500' : 'text-white/40 hover:text-white'}`}
            >
              <FiFilter className="w-4 h-4" />
              <span>{showMoreFilters ? 'Less Filters' : 'More Filters'}</span>
            </button>
          </div>

          {/* Pipeline Kanban Section */}
          <div className="mt-8 pt-4 overflow-hidden">
            <PipelineKanban columns={filteredColumns} onDragEnd={onDragEnd} />
          </div>

        </div>
      </main>

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </DashboardLayout>
  );
};

export default LeadsPipelinePage;
