import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { TbGhostOff } from 'react-icons/tb';
import LoadingSpinner from '../LoadingSpinner';

export type TablePost = {
  _id: string;
  caption: string;
  platforms: string[];
  scheduledAt?: string;
  publishedAt?: string;
  status: 'scheduled' | 'published' | 'failed' | 'cancelled';
};

type Props = {
  title: string;
  rows: TablePost[];
  onRowClick: (row: TablePost) => void;
  onCancel?: (id: string) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  loading?: boolean;
};

const formatDate = (iso?: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const mon = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();
  return `${day}-${mon}-${year}`;
};

const formatTime = (iso?: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const PlatformBadge: React.FC<{ id: string }> = ({ id }) => {
  const map: Record<string, { icon: React.ElementType; name: string; color: string }> = {
    facebook: { icon: FaFacebook, name: 'Facebook', color: '#1877F2' },
    instagram: { icon: FaInstagram, name: 'Instagram', color: '#E4405F' },
    x: { icon: FaTwitter, name: 'X (Twitter)', color: '#1DA1F2' },
    twitter: { icon: FaTwitter, name: 'Twitter', color: '#1DA1F2' },
    linkedin: { icon: FaLinkedin, name: 'LinkedIn', color: '#0A66C2' },
  };
  const meta = map[id] || { icon: FaTwitter, name: id, color: '#9CA3AF' };
  const Icon = meta.icon;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-800 text-gray-200 text-xs" title={meta.name}>
      <Icon size={12} style={{ color: meta.color }} />
      <span className="capitalize">{meta.name}</span>
    </span>
  );
};

const PostsTable: React.FC<Props> = ({ title, rows, onRowClick, onCancel, page, pageSize, total, onPageChange, onPageSizeChange, loading }) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);

  const truncateCaption = (text: string) => {
    const words = (text || '').trim().split(/\s+/);
    return words.length <= 4 ? text || 'No caption' : `${words.slice(0, 4).join(' ')}...`;
  };

  return (
    <div className="mb-6">
      <div className="w-full border-b border-white/10 mb-3">
        <h3 className="text-white font-semibold py-2">{title}</h3>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <LoadingSpinner variant="dark" size="small" />
        </div>
      ) : pageRows.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center text-gray-400">
            <TbGhostOff className="w-6 h-6 mx-auto mb-2 opacity-70" />
            <div className="text-sm">No records found.</div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="min-w-full text-sm">
            <thead className="bg-[#101010] text-gray-300">
              <tr>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Time</th>
                <th className="text-left px-4 py-3">Caption</th>
                <th className="text-left px-4 py-3">Platforms</th>
                <th className="text-left px-4 py-3">Status</th>
                {onCancel && <th className="text-right px-4 py-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {pageRows.map(row => (
                <tr key={row._id} className="border-t border-gray-800 hover:bg-[#141414] cursor-pointer" onClick={() => onRowClick(row)}>
                  <td className="px-4 py-3 text-gray-200">{formatDate(row.publishedAt || row.scheduledAt)}</td>
                  <td className="px-4 py-3 text-gray-200">{formatTime(row.publishedAt || row.scheduledAt)}</td>
                  <td className="px-4 py-3 text-gray-300 max-w-[360px] truncate" title={row.caption || 'No caption'}>{truncateCaption(row.caption || '')}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {row.platforms.map(p => <PlatformBadge key={p} id={p} />)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${row.status === 'published' ? 'bg-green-900 text-green-200' : row.status === 'scheduled' ? 'bg-yellow-900 text-yellow-200' : row.status === 'failed' ? 'bg-red-900 text-red-200' : 'bg-gray-700 text-gray-200'}`}>{row.status}</span>
                  </td>
                  {onCancel && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        <button onClick={(e) => { e.stopPropagation(); onCancel(row._id); }} className="text-xs px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 text-white">Cancel</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && total > 0 && (
      <div className="flex items-center justify-between mt-4 text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            className="bg-[#1E1E1E] border border-gray-700 rounded-lg px-1 py-1.5 text-sm text-gray-200"
          >
            {[5, 10, 20, 50].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <span>
            {total === 0 ? '0-0 of 0' : `${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, total)} of ${total}`}
          </span>
          <div className="flex items-center gap-2">
            <button
              aria-label="Previous page"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="px-3 py-1.5 rounded-lg bg-[white] hover:bg-[#b80000] text-[black] disabled:opacity-40 disabled:hover:bg-[#D60000] inline-flex items-center justify-center"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
              aria-label="Next page"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="px-3 py-1.5 rounded-lg bg-[white] hover:bg-[#b80000] text-[black] disabled:opacity-40 disabled:hover:bg-[#D60000] inline-flex items-center justify-center"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default PostsTable;


