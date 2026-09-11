import React from "react";
import { Link } from "react-router-dom";
import { FiMoreHorizontal, FiClock, FiPhone, FiInbox } from "react-icons/fi";
import { MdDragIndicator } from "react-icons/md";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import IconSelect from "../IconSelect";

interface PipelineCard {
  id: string;
  company: string;
  contact: string;
  value: string;
  priority: "HIGH" | "MED" | "LOW";
  date: string;
  avatar: string;
  lastActivity?: string;
  nextStep?: string;
  projectName?: string;
}

interface Column {
  id: string;
  title: string;
  cards: PipelineCard[];
}

interface PipelineKanbanProps {
  columns: Column[];
  onDragEnd: (result: DropResult) => void;
  onStageChange?: (cardId: string, fromStage: string, toStage: string) => void;
}

const NON_PRIMARY_STAGES = new Set(["hold"]);

const PipelineKanban: React.FC<PipelineKanbanProps> = ({ columns, onDragEnd, onStageChange }) => {
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-red-600 text-white";
      case "MED": return "bg-orange-600 text-white";
      case "LOW": return "bg-white/10 text-white/70 shadow-sm";
      default: return "bg-white/10 text-white/70";
    }
  };

  const totalCards = columns.reduce((sum, col) => sum + col.cards.length, 0);

  if (totalCards === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-8">
        <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-6">
          <FiInbox className="w-9 h-9 text-white/15" />
        </div>
        <h3 className="text-lg font-black text-white/60 uppercase tracking-wide mb-2">No Leads Available</h3>
        <p className="text-sm text-white/30 text-center max-w-md">
          Your pipeline is empty. Add a new project to create your first lead and start tracking deals.
        </p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide min-h-[600px] select-none">
        {columns.map((column) => {
          const isNonPrimary = NON_PRIMARY_STAGES.has(column.id);
          return (
          <div key={column.id} className={`min-w-[280px] sm:min-w-[300px] lg:min-w-[260px] flex-1 flex flex-col gap-4 ${isNonPrimary ? 'opacity-80' : ''}`}>
            {/* Column Header */}
            <div className="flex items-center justify-between px-2 h-8">
              <h3 className="text-xs font-black text-white/90 uppercase tracking-wider flex items-center gap-2">
                {column.title}
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-white/5 text-[10px] font-black text-white/40">
                  {column.cards.length}
                </span>
                {isNonPrimary && (
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-white/5 text-white/25 border border-dashed border-white/10">
                    Non-primary
                  </span>
                )}
              </h3>
              <button className="text-white/30 hover:text-white transition-colors">
                <FiMoreHorizontal />
              </button>
            </div>

            {/* Cards Area */}
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`flex-1 space-y-5 rounded-3xl transition-all p-1 min-h-[150px] ${snapshot.isDraggingOver ? 'bg-red-600/5 ring-1 ring-red-600/10' : ''} ${isNonPrimary ? 'border border-dashed border-white/[0.06]' : ''}`}
                >
                  {column.cards.map((card, index) => (
                    <Draggable key={card.id} draggableId={card.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ ...provided.draggableProps.style }}
                          className={`bg-[#121212] border border-white/[0.03] rounded-2xl p-5 sm:p-6 shadow-xl transition-all group relative overflow-hidden flex flex-col shrink-0 ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-2xl ring-2 ring-red-600/40 z-50' : 'hover:border-red-500/30'}`}
                        >
                          <div className="flex items-start justify-between mb-3.5 shrink-0 gap-2">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${getPriorityStyle(card.priority)}`}>
                              {card.priority}
                            </span>
                            <div className="flex items-center gap-2">
                              {onStageChange && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  onMouseDown={(e) => e.stopPropagation()}
                                  title="Change stage"
                                >
                                  <IconSelect
                                    value={column.id}
                                    onChange={(v) => onStageChange(card.id, column.id, v)}
                                    options={columns.map((c) => ({ value: c.id, label: c.title }))}
                                    className="bg-white/[0.04] border border-white/10 rounded-md text-[9px] font-bold text-white/60 uppercase tracking-wide px-1.5 py-1 focus:outline-none focus:border-red-500/50 hover:bg-white/[0.08] transition-colors cursor-pointer max-w-[92px]"
                                  />
                                </div>
                              )}
                              <MdDragIndicator className="hidden group-hover:block w-5 h-5 text-white/20 transition-all cursor-grab active:cursor-grabbing shrink-0" />
                              <div className="flex gap-1 group-hover:hidden transition-opacity shrink-0">
                                <div className="w-1 h-1 bg-white/20 rounded-full" />
                                <div className="w-1 h-1 bg-white/20 rounded-full" />
                                <div className="w-1 h-1 bg-white/20 rounded-full" />
                              </div>
                            </div>
                          </div>

                          <Link to={`/ai-tools/sales/projects/${card.id}`} className="block shrink-0 group/title min-h-0">
                            <h4 className="text-[15px] font-black text-white group-hover/title:text-red-500 transition-colors capitalize tracking-tight leading-snug line-clamp-2">
                              {card.projectName || card.company}
                            </h4>
                            <p className="text-xs font-medium text-white/40 mt-1.5 line-clamp-1">
                              {card.company}{card.contact ? ` · ${card.contact}` : ""}
                            </p>
                          </Link>

                          <div className="mt-5 shrink-0">
                            <div className="flex items-end justify-between gap-4">
                              <div className="min-w-0 flex-1 space-y-2">
                                <div className="text-xl font-black text-red-500 tracking-tight leading-none">{card.value}</div>
                                {(card.lastActivity || card.nextStep) ? (
                                  <div className="space-y-1.5 pt-1">
                                    {card.lastActivity && (
                                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-wide line-clamp-1">
                                        <FiClock className="w-3 h-3 shrink-0" />
                                        <span>{card.lastActivity}</span>
                                      </div>
                                    )}
                                    {card.nextStep && (
                                      <div className="flex items-start gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-wide line-clamp-2 leading-tight">
                                        <FiPhone className="w-3 h-3 shrink-0 mt-0.5" />
                                        <span>{card.nextStep}</span>
                                      </div>
                                    )}
                                  </div>
                                ) : null}
                              </div>

                              <div className="text-right shrink-0 flex flex-col items-end justify-end gap-2.5">
                                <div className="text-[10px] text-white/30 font-black uppercase tracking-widest">{card.date}</div>
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500/20 to-red-900/20 border border-white/10 flex items-center justify-center text-[10px] font-black text-red-500 uppercase shadow-lg">
                                  {card.contact ? card.contact.split(" ").map(n => n[0]).join("").slice(0, 2) : "?"}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Inner card glow on hover */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 blur-[40px] rounded-full translate-x-8 -translate-y-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export type { PipelineCard, Column };
export default PipelineKanban;
