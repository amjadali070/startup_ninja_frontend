import React, { useEffect, useMemo, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import schedulerService, { type CalendarPost } from '../../services/social-media/scheduler';
import { PLATFORM_BY_ID } from '../../constants/platforms';
import SchedulePostModal from './SchedulePostModal';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const STATUS_DOT: Record<string, string> = {
  scheduled: 'bg-blue-500',
  published: 'bg-emerald-500',
  failed: 'bg-rose-500',
  cancelled: 'bg-gray-500',
  draft: 'bg-purple-500',
};

const ContentCalendar: React.FC = () => {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [posts, setPosts] = useState<CalendarPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CalendarPost | null>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  // Grid always spans full weeks, including the trailing/leading days of adjacent months.
  const gridStart = useMemo(() => {
    const first = new Date(year, month, 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    return start;
  }, [year, month]);

  const gridDays = useMemo(() => {
    const days: Date[] = [];
    const d = new Date(gridStart);
    for (let i = 0; i < 42; i++) {
      days.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return days;
  }, [gridStart]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const rangeStart = toDateKey(gridDays[0]);
    const rangeEnd = toDateKey(gridDays[gridDays.length - 1]);
    schedulerService.listByDateRange(rangeStart, rangeEnd).then((data) => {
      if (!cancelled) {
        setPosts(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [gridDays]);

  const postsByDay = useMemo(() => {
    const map = new Map<string, CalendarPost[]>();
    for (const p of posts) {
      const date = p.scheduledAt || p.publishedAt;
      if (!date) continue;
      const parsed = new Date(date);
      // A malformed (but non-empty) date string used to silently vanish the
      // post from the calendar — toDateKey would build a "NaN-NaN-NaN" key
      // that never matches a real day cell, with no indication anything was
      // wrong. Skip it explicitly and log, so a bad value is at least
      // debuggable instead of just missing.
      if (Number.isNaN(parsed.getTime())) {
        console.warn('ContentCalendar: skipping post with unparseable date', p._id, date);
        continue;
      }
      const key = toDateKey(parsed);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    return map;
  }, [posts]);

  const todayKey = toDateKey(new Date());

  return (
    <div className="w-full rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg md:text-xl font-bold">Content Calendar</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="p-2 rounded-lg bg-[#1E1E1E] border border-gray-700 text-gray-300 hover:bg-[#252525] transition-colors"
            aria-label="Previous month"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-white text-sm font-semibold min-w-[120px] text-center">
            {cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="p-2 rounded-lg bg-[#1E1E1E] border border-gray-700 text-gray-300 hover:bg-[#252525] transition-colors"
            aria-label="Next month"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const now = new Date();
              setCursor(new Date(now.getFullYear(), now.getMonth(), 1));
            }}
            className="ml-1 px-3 py-2 rounded-lg bg-[#1E1E1E] border border-gray-700 text-gray-300 hover:bg-[#252525] transition-colors text-xs font-medium"
          >
            Today
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-center text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider py-1">
            {w}
          </div>
        ))}
      </div>

      <div className={`grid grid-cols-7 gap-1 ${loading ? 'opacity-50' : ''}`}>
        {gridDays.map((d) => {
          const key = toDateKey(d);
          const dayPosts = postsByDay.get(key) || [];
          const isCurrentMonth = d.getMonth() === month;
          const isToday = key === todayKey;

          return (
            <div
              key={key}
              className={`min-h-[70px] sm:min-h-[90px] rounded-lg border p-1.5 ${
                isCurrentMonth ? 'bg-[#151515] border-gray-800' : 'bg-transparent border-gray-900'
              } ${isToday ? 'ring-1 ring-[#DE0500]' : ''}`}
            >
              <div className={`text-[10px] sm:text-xs font-medium mb-1 ${isCurrentMonth ? 'text-gray-300' : 'text-gray-700'} ${isToday ? 'text-[#DE0500] font-bold' : ''}`}>
                {d.getDate()}
              </div>
              <div className="space-y-0.5">
                {dayPosts.slice(0, 3).map((p) => {
                  const platformMeta = PLATFORM_BY_ID[p.platforms[0]];
                  const label = platformMeta?.name || p.platforms[0] || 'Post';
                  return (
                    <button
                      key={p._id}
                      onClick={() => setSelected(p)}
                      title={p.caption || label}
                      className="w-full flex items-center gap-1 px-1 py-0.5 rounded bg-white/5 hover:bg-white/10 transition-colors text-left"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[p.status] || 'bg-gray-500'}`} />
                      <span className="text-[9px] sm:text-[10px] text-gray-300 truncate">{label}</span>
                    </button>
                  );
                })}
                {dayPosts.length > 3 && (
                  <div className="text-[9px] text-gray-500 px-1">+{dayPosts.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <SchedulePostModal post={selected as any} onClose={() => setSelected(null)} />
    </div>
  );
};

export default ContentCalendar;
