import React, { useState, useRef, useEffect, useLayoutEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { FiSearch, FiCheck, FiUserPlus, FiChevronDown } from "react-icons/fi";
import type { Lead, TeamAssigneeMember } from "../../services/ninjaSales";

const AVATAR_GRADIENTS = [
  "from-violet-500 to-fuchsia-600",
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-violet-600",
];

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h << 5) - h + id.charCodeAt(i);
  return Math.abs(h);
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function AssigneeAvatar({
  name,
  id,
  size = "md",
}: {
  name: string;
  id: string;
  size?: "sm" | "md";
}) {
  const grad = AVATAR_GRADIENTS[hashId(id) % AVATAR_GRADIENTS.length];
  const sizeCls = size === "sm" ? "w-7 h-7 text-[10px]" : "w-8 h-8 text-[11px]";
  return (
    <div
      className={`flex-shrink-0 rounded-full bg-gradient-to-br ${grad} ${sizeCls} flex items-center justify-center font-bold text-white shadow-sm ring-2 ring-black/20`}
    >
      {initials(name)}
    </div>
  );
}

export interface LeadAssigneePickerProps {
  lead: Lead;
  teamMembers: TeamAssigneeMember[];
  saving?: boolean;
  disabled?: boolean;
  onAssign: (userId: string | null) => void;
}

/**
 * ClickUp-style assignee control: compact avatar / “Assign” chip, searchable popover list.
 */
const LeadAssigneePicker: React.FC<LeadAssigneePickerProps> = ({
  lead,
  teamMembers,
  saving = false,
  disabled = false,
  onAssign,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0, width: 300 });
  /** True only after layout has measured the trigger — avoids a flash at (0,0). */
  const [panelReady, setPanelReady] = useState(false);
  /** Drives enter transition after the panel is in the correct place. */
  const [panelEnter, setPanelEnter] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const ESTIMATED_PANEL_HEIGHT = 300;

  const computePanelPosition = useCallback((): { top: number; left: number; width: number } | null => {
    const el = rootRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const w = Math.min(300, window.innerWidth - 16);
    let left = r.left;
    if (left + w > window.innerWidth - 8) left = Math.max(8, window.innerWidth - w - 8);
    if (left < 8) left = 8;

    const gap = 6;
    let top = r.bottom + gap;
    // Prefer opening below the trigger; flip above if there isn't room
    if (top + ESTIMATED_PANEL_HEIGHT > window.innerHeight - 8) {
      const above = r.top - gap - ESTIMATED_PANEL_HEIGHT;
      if (above >= 8) {
        top = above;
      } else {
        top = Math.max(8, Math.min(top, window.innerHeight - ESTIMATED_PANEL_HEIGHT - 8));
      }
    }

    return { top, left, width: w };
  }, []);

  const updatePanelPosition = useCallback(() => {
    const pos = computePanelPosition();
    if (pos) setPanelPos(pos);
  }, [computePanelPosition]);

  const mergedMembers = useMemo(() => {
    const uid = lead.assignedToUserId ? String(lead.assignedToUserId) : "";
    if (!uid || teamMembers.some((m) => m._id === uid)) return teamMembers;
    return [
      ...teamMembers,
      {
        _id: uid,
        fullname: lead.assignee?.fullname || lead.assignedTo || "Former assignee",
        email: lead.assignee?.email || "",
        teamRole: lead.assignee?.teamRole,
        isOwner: false,
      } satisfies TeamAssigneeMember,
    ];
  }, [lead, teamMembers]);

  const currentId = lead.assignedToUserId ? String(lead.assignedToUserId) : "";
  const currentMember = mergedMembers.find((m) => m._id === currentId);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mergedMembers;
    return mergedMembers.filter(
      (m) =>
        m.fullname.toLowerCase().includes(q) ||
        (m.email && m.email.toLowerCase().includes(q))
    );
  }, [mergedMembers, query]);

  /** Measure synchronously before paint so the portal never appears at (0,0). */
  useLayoutEffect(() => {
    if (!open) {
      setPanelReady(false);
      setPanelEnter(false);
      return;
    }
    const pos = computePanelPosition();
    if (!pos) {
      setPanelReady(false);
      return;
    }
    setPanelPos(pos);
    setPanelReady(true);
  }, [open, computePanelPosition]);

  /** Smooth enter: next frame after mount so transition runs from a stable position. */
  useEffect(() => {
    if (!panelReady) return;
    setPanelEnter(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPanelEnter(true));
    });
    return () => cancelAnimationFrame(id);
  }, [panelReady]);

  useEffect(() => {
    if (!open || !panelReady) return;

    window.addEventListener("scroll", updatePanelPosition, true);
    window.addEventListener("resize", updatePanelPosition);

    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      if (panelRef.current?.contains(t)) return;
      setOpen(false);
      setQuery("");
    };

    const t = window.setTimeout(() => {
      document.addEventListener("mousedown", onDoc);
    }, 0);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("scroll", updatePanelPosition, true);
      window.removeEventListener("resize", updatePanelPosition);
    };
  }, [open, panelReady, updatePanelPosition]);

  useEffect(() => {
    if (!panelEnter || !open) return;
    searchRef.current?.focus();
  }, [panelEnter, open]);

  const handlePick = useCallback(
    (userId: string | null) => {
      const next = userId || null;
      const prev = currentId || null;
      if (next === prev) {
        setOpen(false);
        setQuery("");
        return;
      }
      onAssign(next);
      setOpen(false);
      setQuery("");
    },
    [currentId, onAssign]
  );

  if (disabled) {
    const name = currentMember?.fullname || lead.assignee?.fullname || lead.assignedTo;
    if (!name) {
      return <span className="text-white/30 text-sm">—</span>;
    }
    return (
      <div className="flex items-center gap-2 min-w-0 max-w-[200px]">
        <AssigneeAvatar name={name} id={currentMember?._id || currentId || "x"} size="sm" />
        <span className="text-sm text-white/75 truncate">{name}</span>
      </div>
    );
  }

  return (
    <div className="relative inline-flex" ref={rootRef}>
      <button
        type="button"
        disabled={saving}
        onClick={() => !saving && setOpen((o) => !o)}
        className={`
          group flex items-center gap-2 rounded-lg pl-1 pr-2 py-1 min-h-[32px] max-w-[220px]
          transition-all duration-150 border
          ${open ? "bg-white/[0.08] border-white/20 shadow-lg shadow-black/30" : "bg-transparent border-transparent hover:bg-white/[0.06] hover:border-white/10"}
          ${saving ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        {saving ? (
          <span className="flex items-center gap-2 pl-1 pr-1">
            <span className="inline-block h-7 w-7 rounded-full border border-white/15 border-t-red-500 animate-spin" />
            <span className="text-[12px] text-white/45">Saving…</span>
          </span>
        ) : currentMember ? (
          <>
            <AssigneeAvatar name={currentMember.fullname} id={currentMember._id} size="sm" />
            <span className="text-[13px] text-white/85 truncate max-w-[128px] font-medium">
              {currentMember.fullname}
            </span>
          </>
        ) : (
          <span className="flex items-center gap-1.5 text-[13px] text-white/40 group-hover:text-white/60 pl-1">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-white/20 bg-white/[0.03] group-hover:border-red-500/50 group-hover:bg-red-500/10 transition-colors">
              <FiUserPlus className="w-3.5 h-3.5" />
            </span>
            <span className="font-medium">Assign</span>
          </span>
        )}
        <FiChevronDown
          className={`w-3.5 h-3.5 text-white/35 flex-shrink-0 transition-transform ${open ? "rotate-180 text-white/55" : ""}`}
        />
      </button>

      {open &&
        panelReady &&
        createPortal(
        <div
          ref={panelRef}
          style={{
            position: "fixed",
            top: panelPos.top,
            left: panelPos.left,
            width: panelPos.width,
            transformOrigin: "top left",
          }}
          className={`
            z-[200] rounded-xl border border-white/[0.08] bg-[#1a1a1f] shadow-[0_16px_48px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)]
            overflow-hidden will-change-transform
            transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${panelEnter ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-1 scale-[0.98]"}
          `}
          role="listbox"
        >
          <div className="p-2 border-b border-white/[0.06]">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search people…"
                className="w-full rounded-lg bg-white/[0.06] border border-white/[0.06] py-2 pl-9 pr-3 text-[13px] text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/55"
              />
            </div>
          </div>

          <div className="max-h-[260px] overflow-y-auto custom-scrollbar py-1">
            <button
              type="button"
              onClick={() => handlePick(null)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors
                ${!currentId ? "bg-red-500/12" : "hover:bg-white/[0.05]"}
              `}
            >
              <div className="w-8 h-8 rounded-full border border-dashed border-white/25 flex items-center justify-center bg-white/[0.03] flex-shrink-0">
                <span className="text-[10px] text-white/40 font-semibold">—</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-[13px] font-medium ${!currentId ? "text-red-400" : "text-white/80"}`}>
                  Unassigned
                </div>
                <div className="text-[11px] text-white/35">No one is responsible</div>
              </div>
              {!currentId ? (
                <FiCheck className="w-4 h-4 text-red-500 flex-shrink-0" />
              ) : null}
            </button>

            <div className="h-px bg-white/[0.06] mx-2 my-1" />

            {filtered.length === 0 ? (
              <div className="px-3 py-6 text-center text-[13px] text-white/35">No people match</div>
            ) : (
              filtered.map((m) => {
                const selected = currentId === m._id;
                return (
                  <button
                    key={m._id}
                    type="button"
                    onClick={() => handlePick(m._id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 text-left transition-colors
                      ${selected ? "bg-red-500/10" : "hover:bg-white/[0.05]"}
                    `}
                  >
                    <AssigneeAvatar name={m.fullname} id={m._id} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-white/90 truncate">
                        {m.fullname}
                        {m.isOwner ? (
                          <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wide text-white/35">
                            Owner
                          </span>
                        ) : null}
                      </div>
                      {m.email ? (
                        <div className="text-[11px] text-white/40 truncate">{m.email}</div>
                      ) : null}
                    </div>
                    {selected ? <FiCheck className="w-4 h-4 text-red-500 flex-shrink-0" /> : null}
                  </button>
                );
              })
            )}
          </div>
        </div>,
        document.body
        )}
    </div>
  );
};

export default LeadAssigneePicker;
