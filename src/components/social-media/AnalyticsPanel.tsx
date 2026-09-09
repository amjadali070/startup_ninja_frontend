import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiClock, FiXCircle, FiFileText, FiTrendingUp, FiHeart, FiMessageCircle, FiShare2 } from 'react-icons/fi';
import schedulerService, { type AnalyticsData } from '../../services/social-media/scheduler';
import { PLATFORM_BY_ID } from '../../constants/platforms';
import LoadingSpinner from '../LoadingSpinner';

const RANGE_OPTIONS = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div className="bg-[#151515] border border-gray-800 rounded-xl p-3 sm:p-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider font-semibold">{label}</span>
      <span className={color}>{icon}</span>
    </div>
    <div className="text-xl sm:text-2xl font-bold text-white">{value}</div>
  </div>
);

const AnalyticsPanel: React.FC = () => {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    schedulerService.getAnalytics(days).then((res) => {
      if (cancelled) return;
      if (res.success && res.data) setData(res.data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [days]);

  const maxDaily = data ? Math.max(1, ...data.dailyTrend.map((d) => d.count)) : 1;
  const maxPlatform = data ? Math.max(1, ...Object.values(data.platformCounts)) : 1;

  return (
    <div className="w-full rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg md:text-xl font-bold">Analytics</h2>
        <div className="flex items-center gap-1 bg-[#1E1E1E] border border-gray-700 rounded-lg p-1">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.days}
              onClick={() => setDays(opt.days)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                days === opt.days ? 'bg-[#DE0500] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <LoadingSpinner variant="dark" size="small" />
        </div>
      ) : !data || data.totalPosts === 0 ? (
        <div className="text-center py-10 text-gray-500 text-sm">
          No posts yet — analytics will appear once you publish or schedule your first post.
        </div>
      ) : (
        <div className="space-y-5">
          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <StatCard label="Total Posts" value={data.totalPosts} icon={<FiFileText className="w-4 h-4" />} color="text-gray-400" />
            <StatCard label="Published" value={data.statusCounts.published} icon={<FiCheckCircle className="w-4 h-4" />} color="text-emerald-400" />
            <StatCard label="Scheduled" value={data.statusCounts.scheduled} icon={<FiClock className="w-4 h-4" />} color="text-cyan-400" />
            <StatCard label="Failed" value={data.statusCounts.failed} icon={<FiXCircle className="w-4 h-4" />} color="text-rose-400" />
          </div>

          {data.successRate !== null && (
            <div className="bg-[#151515] border border-gray-800 rounded-xl p-3 sm:p-4 flex items-center gap-3">
              <FiTrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-white font-semibold text-sm">{data.successRate}% success rate</div>
                <div className="text-gray-500 text-xs">Published vs. failed, across all time</div>
              </div>
            </div>
          )}

          {/* Daily trend */}
          <div>
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Posting activity — last {data.rangeDays} days
            </h3>
            <div className="flex items-end gap-[2px] h-20 bg-[#151515] border border-gray-800 rounded-xl p-2">
              {data.dailyTrend.map((d) => (
                <div
                  key={d.date}
                  className="flex-1 min-w-[2px] bg-[#DE0500]/70 hover:bg-[#DE0500] rounded-sm transition-colors"
                  style={{ height: `${Math.max(4, (d.count / maxDaily) * 100)}%` }}
                  title={`${d.date}: ${d.count} post${d.count === 1 ? '' : 's'}`}
                />
              ))}
            </div>
          </div>

          {/* Platform breakdown */}
          {Object.keys(data.platformCounts).length > 0 && (
            <div>
              <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">By platform</h3>
              <div className="space-y-2">
                {Object.entries(data.platformCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([platform, count]) => {
                    const meta = PLATFORM_BY_ID[platform];
                    return (
                      <div key={platform} className="flex items-center gap-3">
                        <span className="text-xs text-gray-300 w-20 shrink-0 truncate">{meta?.name || platform}</span>
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#DE0500] rounded-full"
                            style={{ width: `${Math.max(4, (count / maxPlatform) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-6 text-right shrink-0">{count}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Real engagement — from Facebook/Instagram's own APIs, not estimated */}
          {data.engagement.postsCounted > 0 && (
            <div>
              <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Engagement — Facebook &amp; Instagram, last {data.engagement.postsCounted} post{data.engagement.postsCounted === 1 ? '' : 's'}
              </h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <StatCard label="Likes" value={data.engagement.totalLikes} icon={<FiHeart className="w-4 h-4" />} color="text-rose-400" />
                <StatCard label="Comments" value={data.engagement.totalComments} icon={<FiMessageCircle className="w-4 h-4" />} color="text-cyan-400" />
                <StatCard label="Shares" value={data.engagement.totalShares} icon={<FiShare2 className="w-4 h-4" />} color="text-emerald-400" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsPanel;
