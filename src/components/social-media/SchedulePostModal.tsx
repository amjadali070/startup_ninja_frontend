import React, { useMemo, useState, useEffect } from 'react';
import {  FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaClock, FaCheckCircle, FaTimesCircle, FaBan, FaRegCalendarAlt, FaPencilAlt } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { formatDateDDMonYYYY, formatTimeHHmm } from '../../utils/date';
import { PLATFORM_BY_ID } from '../../constants/platforms';
import LoadingSpinner from '../LoadingSpinner';

// Reusing existing types and utilities
export type ModalPost = {
  _id: string;
  caption: string;
  platforms: string[];
  scheduledAt?: string;
  publishedAt?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed' | 'cancelled';
  results?: Record<string, any>;
  image?: { originalname?: string; mimetype?: string; buffer?: string; url?: string; key?: string } | null;
  accounts?: Array<{
    platform: string;
    name?: string;
    username?: string;
    profileImage?: string;
  }>;
};

type Props = {
  post: ModalPost | null;
  onClose: () => void;
  onCancel?: (id: string) => void;
};

// Utilities (kept clean and functional)
// use shared formatters

// --- Modern Status Mapping ---
const STATUS_META = {
  draft: { icon: FaPencilAlt, color: 'text-purple-400', name: 'Draft', ring: 'ring-purple-500/30', bg: 'bg-purple-500/10' },
  published: { icon: FaCheckCircle, color: 'text-emerald-400', name: 'Published', ring: 'ring-emerald-500/30', bg: 'bg-emerald-500/10' },
  scheduled: { icon: FaClock, color: 'text-cyan-400', name: 'Scheduled', ring: 'ring-cyan-500/30', bg: 'bg-cyan-500/10' },
  failed: { icon: FaTimesCircle, color: 'text-rose-400', name: 'Failed', ring: 'ring-rose-500/30', bg: 'bg-rose-500/10' },
  cancelled: { icon: FaBan, color: 'text-gray-400', name: 'Cancelled', ring: 'ring-gray-500/30', bg: 'bg-gray-500/10' },
};

// --- Platform Icon Mapping ---
const PLATFORM_META: Record<string, { icon: React.ElementType; color: string; name: string }> = {
  facebook: { icon: FaFacebook, color: '#1877F2', name: 'Facebook' },
  instagram: { icon: FaInstagram, color: '#E4405F', name: 'Instagram' },
  x: { icon: FaTwitter, color: '#1DA1F2', name: 'X (Twitter)' },
  twitter: { icon: FaTwitter, color: '#1DA1F2', name: 'Twitter' },
  linkedin: { icon: FaLinkedin, color: '#0A66C2', name: 'LinkedIn' },
};

// Component for Status Badge
const PostStatusBadge: React.FC<{ status: ModalPost['status'] }> = ({ status }) => {
  const meta = STATUS_META[status];
  const Icon = meta.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${meta.bg} ${meta.color} font-semibold text-xs ring-1 ${meta.ring} transition-all`}>
      <Icon className="w-3 h-3" />
      <span className="uppercase tracking-widest">{meta.name}</span>
    </div>
  );
};

// Reserved for future detail rows

const SchedulePostModal: React.FC<Props> = ({ post, onClose }) => {

  const imageSrc = useMemo(() => {
    if (!post) return null;
    
    // 1. Prefer S3/Stored URL if available
    if (post.image?.url) return post.image.url;

    // 2. Fallback to Buffer (Legacy)
    if (post.image?.buffer) {
      const mime = post.image.mimetype || 'image/jpeg';
      return `data:${mime};base64,${post.image.buffer}`;
    }

    // 3. Fallback to platform specific results
    const ig = (post.results as any)?.instagram?.response?.data;
    if (ig?.imageUrl) return ig.imageUrl as string;
    const fb = (post.results as any)?.facebook?.response?.imageUrl;
    if (fb) return fb as string;

    return null;
  }, [post]);

  const [imgLoading, setImgLoading] = useState(true);

  useEffect(() => {
    if (imageSrc) {
      setImgLoading(true);
    }
  }, [imageSrc]);

  if (!post) return null;

  const dateToUse = post.publishedAt || post.scheduledAt;
  const isScheduled = post.status === 'scheduled';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop - Deep, immersive blur */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Container - Sleek Charcoal, high contrast border, soft rounding */}
      <div className="relative w-full max-w-5xl max-h-[90vh] sm:max-h-[85vh] mx-auto bg-[#101014] border border-[#2c2c34] shadow-2xl rounded-xl overflow-hidden text-white transform transition-all duration-300">
        
        {/* Header - Simple, aligned top-bar */}
        <div className="flex items-center justify-between p-4 border-b border-[#2c2c34]">
          <h2 className="text-xl font-bold tracking-wider uppercase text-gray-200">Post Insight</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-[#1a1a1f]" aria-label="Close">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-[#2c2c34] max-h-[78vh] sm:max-h-[75vh] overflow-y-auto lg:overflow-hidden">

          <div className="lg:col-span-3 p-3 space-y-3">

            <h3 className="text-lg font-semibold text-gray-200">Post Content</h3>
            
            <div className="p-2 space-y-4">
                
                {imageSrc ? (
                  <div className="relative w-full rounded-md overflow-hidden bg-black/40 flex items-center justify-center border-2 border-dotted border-gray-600 min-h-[150px]" style={{ borderStyle: 'dotted', borderSpacing: '4px' }}>
                    {imgLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                        <LoadingSpinner size="small" variant="dark" />
                      </div>
                    )}
                    <img
                      src={imageSrc}
                      alt={post.caption ? post.caption.slice(0, 60) : 'Post media'}
                      className={`w-full max-h-72 object-contain transition-opacity duration-300 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
                      loading="lazy"
                      onLoad={() => setImgLoading(false)}
                      onError={() => setImgLoading(false)}
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-black/50 flex items-center justify-center rounded-md border-2 border-dotted border-gray-600" style={{ borderStyle: 'dotted', borderSpacing: '4px' }}>
                    <span className="text-gray-500 text-sm">No visual media attached</span>
                  </div>
                )}
                
                <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap break-words min-h-[40px] max-h-40 md:max-h-56 overflow-y-auto pr-1 pt-2">
                 {post.caption || <span className="text-gray-500 italic">No caption added.</span>}
                </div>
            </div>
          </div>

          <div className="lg:col-span-2 p-6 space-y-4">
            
            <div className="space-y-4 border-b border-gray-700/50 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                <PostStatusBadge status={post.status} />
                
            </div>
            {dateToUse ? (
              <div className="text-sm font-light text-gray-300 flex items-center gap-2">
                      <FaRegCalendarAlt className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-gray-400">{isScheduled ? 'Scheduled at:' : 'Published at:'}</span>
                      <span className="font-semibold text-white">{formatDateDDMonYYYY(dateToUse)} at {formatTimeHHmm(dateToUse)}</span>
                  </div>
            ) : (
              <div className="text-sm font-light text-gray-400 flex items-center gap-2">
                <FaRegCalendarAlt className="w-3.5 h-3.5 text-purple-400" />
                <span>Not scheduled yet — still a draft</span>
              </div>
            )}
            </div>
            
            <div className='border-b border-gray-700/50 pb-4'>
              <h3 className="text-lg font-semibold text-gray-200 mb-3">Target Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {post.platforms?.map((p) => {
                  const meta = PLATFORM_BY_ID[p] ? { icon: PLATFORM_BY_ID[p].icon, color: PLATFORM_BY_ID[p].colors.brand, name: PLATFORM_BY_ID[p].name } : { icon: FaTwitter, color: '#9CA3AF', name: p };
                  const Icon = meta.icon;
                  return (
                    <div key={p} className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1f] rounded-full border border-[#2c2c34]">
                      <Icon size={14} style={{ color: meta.color }} />
                      <span className="text-gray-300 text-xs font-medium uppercase tracking-wider">{meta.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Accounts */}
            {Array.isArray(post.accounts) && post.accounts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-3">Accounts</h3>
                <div className="space-y-3">
                  {post.accounts.map((acc, idx) => {
                    const meta = PLATFORM_META[acc.platform] || { icon: FaTwitter, color: '#9CA3AF', name: acc.platform };
                    const Icon = meta.icon;
                    const initials = (acc.name || acc.username || meta.name || '?').trim().charAt(0).toUpperCase();
                    return (
                      <div key={`${acc.platform}-${idx}`} className="flex items-center justify-between bg-[#1a1a1f] border border-[#2c2c34] rounded-lg p-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex items-center justify-center w-9 h-9 rounded-full border border-[#2c2c34] overflow-hidden bg-[#0f0f13] flex-shrink-0">
                            {acc.profileImage ? (
                              <img src={acc.profileImage} alt={acc.username || acc.name || 'Account'} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            ) : (
                              <span className="text-gray-300 text-sm font-semibold">{initials}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-white text-sm truncate">{acc.name || acc.username || 'Unknown account'}</div>
                            <div className="text-gray-400 text-xs truncate">{acc.username ? `@${acc.username.replace(/^@/, '')}` : meta.name}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon size={14} style={{ color: meta.color }} />
                          <span className="text-gray-400 text-xs uppercase tracking-wider">{meta.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SchedulePostModal;