import React from "react";
import { FiMoreHorizontal, FiClock, FiPhone } from "react-icons/fi";
import { MdDragIndicator } from "react-icons/md";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

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
}

interface Column {
  id: string;
  title: string;
  cards: PipelineCard[];
}

interface PipelineKanbanProps {
  columns: Column[];
  onDragEnd: (result: DropResult) => void;
}

const PipelineKanban: React.FC<PipelineKanbanProps> = ({ columns, onDragEnd }) => {
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-red-600 text-white";
      case "MED": return "bg-orange-600 text-white";
      case "LOW": return "bg-white/10 text-white/70 shadow-sm";
      default: return "bg-white/10 text-white/70";
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide min-h-[600px] select-none">
        {columns.map((column) => (
          <div key={column.id} className="min-w-[280px] sm:min-w-[300px] lg:min-w-[260px] flex-1 flex flex-col gap-4">
            {/* Column Header */}
            <div className="flex items-center justify-between px-2 h-8">
              <h3 className="text-xs font-black text-white/90 uppercase tracking-wider flex items-center gap-2">
                {column.title} 
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-white/5 text-[10px] font-black text-white/40">
                  {column.cards.length}
                </span>
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
                  className={`flex-1 space-y-4 rounded-3xl transition-all p-1 min-h-[150px] ${snapshot.isDraggingOver ? 'bg-red-600/5 ring-1 ring-red-600/10' : ''}`}
                >
                  {column.cards.map((card, index) => (
                    <Draggable key={card.id} draggableId={card.id} index={index}>
                      {(provided, snapshot) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ ...provided.draggableProps.style }}
                          className={`bg-[#121212] border border-white/[0.03] rounded-2xl p-6 shadow-xl transition-all group relative overflow-hidden ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-2xl ring-2 ring-red-600/40 z-50' : 'hover:border-red-500/30'}`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${getPriorityStyle(card.priority)}`}>
                              {card.priority}
                            </span>
                            <div className="flex items-center gap-1">
                              <MdDragIndicator className="hidden group-hover:block w-5 h-5 text-white/20 transition-all cursor-grab active:cursor-grabbing" />
                              <div className="flex gap-1 group-hover:hidden transition-opacity">
                                <div className="w-1 h-1 bg-white/20 rounded-full" />
                                <div className="w-1 h-1 bg-white/20 rounded-full" />
                                <div className="w-1 h-1 bg-white/20 rounded-full" />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1 mb-6">
                            <h4 className="text-base font-black text-white group-hover:text-red-500 transition-colors uppercase tracking-tight">
                              {card.company}
                            </h4>
                            <p className="text-sm font-medium text-white/40">{card.contact}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xl font-black text-red-500 tracking-tight">{card.value}</div>
                              {card.lastActivity && (
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 mt-2 uppercase tracking-wide">
                                  <FiClock className="w-3 h-3" />
                                  <span>{card.lastActivity}</span>
                                </div>
                              )}
                              {card.nextStep && (
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 mt-2 uppercase tracking-wide">
                                  <FiPhone className="w-3 h-3" />
                                  <span>{card.nextStep}</span>
                                </div>
                              )}
                            </div>

                            <div className="text-right">
                              <div className="text-[10px] text-white/30 font-black mb-2 uppercase tracking-widest">{card.date}</div>
                              <img 
                                src={card.avatar} 
                                alt={card.contact} 
                                className="w-8 h-8 rounded-xl border border-white/10 ml-auto grayscale hover:grayscale-0 transition-all shadow-lg"
                              />
                            </div>
                          </div>
                          
                          {/* Inner card glow on hover */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 blur-[40px] rounded-full translate-x-8 -translate-y-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export type { PipelineCard, Column };
export default PipelineKanban;
