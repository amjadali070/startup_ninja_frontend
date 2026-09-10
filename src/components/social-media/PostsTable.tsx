import React from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
  FiX,
  FiEdit3,
} from 'react-icons/fi';
import { MdCancel } from "react-icons/md";
import { TbGhostOff } from 'react-icons/tb';
import { RiCalendarScheduleLine } from "react-icons/ri";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import LoadingSpinner from '../LoadingSpinner';
import PlatformBadge from './PlatformBadge';
import { useUserTimezone } from '../../hooks/useUserTimezone';

export type TablePost = {
  _id: string;
  caption: string;
  platforms: string[];
  scheduledAt?: string;
  publishedAt?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed' | 'cancelled';
};

type Props = {
  title: string;
  rows: TablePost[];
  onRowClick: (row: TablePost) => void;
  onEdit: (row: TablePost) => void;
  onDelete: (row: TablePost) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  loading?: boolean;
};

// Both formatters render in the viewer's saved IANA timezone (not the browser's local zone) so
// a scheduled time shown here always matches what SchedulingOption showed when it was set.
const formatDate = (dateString: string | undefined, ianaTimezone: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: ianaTimezone,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
    .format(date)
    .replace(/\//g, '-');
};

const formatTime = (dateString: string | undefined, ianaTimezone: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('en-US', {
    timeZone: ianaTimezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
    .format(date)
    .toLowerCase();
};

const PostsTable: React.FC<Props> = ({
  title,
  rows,
  onRowClick,
  onEdit,
  onDelete,
  page,
  pageSize,
  total,
  onPageChange,
  loading,
}) => {
  const { ianaTimezone } = useUserTimezone();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);

  const truncateCaption = (text: string) => {
    const words = (text || '').trim().split(/\s+/);
    return words.length <= 4
      ? text || 'No caption'
      : `${words.slice(0, 4).join(' ')}...`;
  };

  return (
    <div className="mb-6">
      <h3 className="text-white font-semibold text-lg mb-4">{title}</h3>

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
        <div className="overflow-x-auto border border-gray-800 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="text-gray-400 bg-[#0D0D0D]">
              <tr>
                <th className="text-left px-2 sm:px-3 md:px-4 py-3 font-medium">Date</th>
                <th className="text-left px-2 sm:px-3 md:px-4 py-3 font-medium">Time</th>
                <th className="text-left px-2 sm:px-3 md:px-4 py-3 font-medium">
                  Caption
                </th>
                <th className="text-left px-2 sm:px-3 md:px-4 py-3 font-medium">
                  Platform
                </th>
                <th className="text-left px-2 sm:px-3 md:px-4 py-3 font-medium">
                  Status
                </th>
                <th className="text-left px-2 sm:px-3 md:px-4 py-3 font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr
                  key={row._id}
                  className="bg-[#1E1E1E] hover:bg-[#141414] cursor-pointer"
                  onClick={() => onRowClick(row)}
                >
                  <td className="px-2 sm:px-3 md:px-4 py-4 text-gray-300 whitespace-nowrap">
                    {formatDate(row.publishedAt || row.scheduledAt, ianaTimezone)}
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-4 text-gray-300 whitespace-nowrap">
                    {formatTime(row.publishedAt || row.scheduledAt, ianaTimezone)}
                  </td>
                  <td
                    className="px-2 sm:px-3 md:px-4 py-4 text-gray-300 max-w-[150px] sm:max-w-[220px] md:max-w-[360px] truncate"
                    title={row.caption || 'No caption'}
                  >
                    {truncateCaption(row.caption || '')}
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {row.platforms.map((p) => (
                        <PlatformBadge key={p} id={p} />
                      ))}
                    </div>
                  </td>

                  <td className="px-2 sm:px-3 md:px-4 py-4">
                    {row.status === 'draft' ? (
                      <span
                        className="inline-flex items-center justify-center w-20 sm:w-24 md:w-28 gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium text-[#A855F7]"
                        style={{
                          background: '#A855F70D',
                          border: '1.2px solid #A855F780',
                        }}
                      >
                        <FiEdit3 className="w-3.5 h-3.5" />
                        DRAFT
                      </span>
                    ) : row.status === 'published' ? (
                      <span
                        className="inline-flex items-center justify-center w-20 sm:w-24 md:w-28 gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium text-[#22C55E]"
                        style={{
                          background: '#00E01A0D',
                          border: '1.2px solid #00E01A80',
                        }}
                      >
                        <HiCheckCircle className="w-3.5 h-3.5" />
                        PUBLISHED
                      </span>
                    ) : row.status === 'scheduled' ? (
                      <span
                        className="inline-flex items-center justify-center w-20 sm:w-24 md:w-28 gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium text-[#2563EB]"
                        style={{
                          background: '#2563EB0D',
                          border: '1.2px solid #2563EB',
                        }}
                      >
                        <RiCalendarScheduleLine className="w-3.5 h-3.5" />
                        SCHEDULED
                      </span>
                    ) : row.status === 'failed' ? (
                      <span
                        className="inline-flex items-center justify-center w-20 sm:w-24 md:w-28 gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium text-[#DC2626]"
                        style={{
                          background: '#2563EB0D',
                          border: '1.2px solid #DC2626',
                        }}
                      >
                        <HiXCircle className="w-3.5 h-3.5" />
                        FAILED
                      </span>
                    ) : row.status === 'cancelled' ? (
                      <span
                        className="inline-flex items-center justify-center w-20 sm:w-24 md:w-28 gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium text-[#6B7280]"
                        style={{
                          background: '#6B72800D',
                          border: '1.2px solid #6B7280',
                        }}
                      >
                        <MdCancel className="w-3.5 h-3.5" />
                        CANCELLED
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-20 sm:w-24 md:w-28 gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-400">
                        {(row.status as string).toUpperCase()}
                      </span>
                    )}
                  </td>

                  <td className="px-2 sm:px-3 md:px-4 py-4">
                    <div className="flex items-center justify-center gap-3">
                      {row.status === 'scheduled' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row);
                          }}
                          className="text-[#DE0500] hover:opacity-75 transition-opacity"
                          aria-label="Cancel scheduled post"
                          title="Cancel scheduled post"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(row);
                          }}
                          className="text-[#DE0500] hover:opacity-75 transition-opacity"
                          aria-label="Delete post"
                          title="Delete post permanently"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && total > 0 && (
        <div className="flex items-center justify-end mt-4 text-sm text-gray-300">
          <div className="flex items-center gap-4">
            <span>
              {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous page"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="p-1.5 rounded-md text-gray-400 disabled:opacity-40 disabled:hover:bg-transparent disabled:bg-[#FFFFFF0D] border border-[#FFFFFF1A]"
                style={page > 1 ? { background: 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)', boxShadow: '0px 10.67px 22.22px 0px #7F1D1D80' } : {}}
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button
                aria-label="Next page"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="p-1.5 rounded-md text-gray-400 disabled:opacity-40 disabled:hover:bg-transparent disabled:bg-[#FFFFFF0D] border border-[#FFFFFF1A]"
                style={page < totalPages ? { background: 'linear-gradient(90deg, #DC2626 0%, #B91C1C 100%)', boxShadow: '0px 10.67px 22.22px 0px #7F1D1D80' } : {}}
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