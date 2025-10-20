import React, { useMemo } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaClock, FaCheckCircle, FaTimesCircle, FaBan, FaRegCalendarAlt } from 'react-icons/fa';
import { formatDateDDMonYYYY, formatTimeHHmm } from '../../utils/date';
import FacebookPreview from './previews/FacebookPreview';
import InstagramPreview from './previews/InstagramPreview';
import LinkedInPreview from './previews/LinkedInPreview';
import TwitterPreview from './previews/TwitterPreview';
import LoadingSpinner from '../LoadingSpinner';

export type PostDetailsItem = {
  _id: string;
  caption: string;
  platforms: string[];
  scheduledAt?: string;
  publishedAt?: string;
  status: 'scheduled' | 'published' | 'failed' | 'cancelled';
  results?: Record<string, any>;
  image?: { originalname?: string; mimetype?: string; buffer?: string } | null;
  accounts?: Array<{
    platform: string;
    name?: string;
    username?: string;
    profileImage?: string;
  }>;
};

const STATUS_META = {
  published: { icon: FaCheckCircle, color: 'text-emerald-400', name: 'Published', ring: 'ring-emerald-500/30', bg: 'bg-emerald-500/10' },
  scheduled: { icon: FaClock, color: 'text-cyan-400', name: 'Scheduled', ring: 'ring-cyan-500/30', bg: 'bg-cyan-500/10' },
  failed: { icon: FaTimesCircle, color: 'text-rose-400', name: 'Failed', ring: 'ring-rose-500/30', bg: 'bg-rose-500/10' },
  cancelled: { icon: FaBan, color: 'text-gray-400', name: 'Cancelled', ring: 'ring-gray-500/30', bg: 'bg-gray-500/10' },
};

const PLATFORM_META: Record<string, { icon: React.ElementType; color: string; name: string }> = {
  facebook: { icon: FaFacebook, color: '#1877F2', name: 'Facebook' },
  instagram: { icon: FaInstagram, color: '#E4405F', name: 'Instagram' },
  x: { icon: FaTwitter, color: '#1DA1F2', name: 'X (Twitter)' },
  twitter: { icon: FaTwitter, color: '#1DA1F2', name: 'Twitter' },
  linkedin: { icon: FaLinkedin, color: '#0A66C2', name: 'LinkedIn' },
};

type Props = {
  post: PostDetailsItem | null;
};

const PostDetailsView: React.FC<Props> = ({ post }) => {
  const imageSrc = useMemo(() => {
    if (!post) return null;
    const ig = (post.results as any)?.instagram?.response?.data;
    if (ig?.imageUrl) return ig.imageUrl as string;
    const fb = (post.results as any)?.facebook?.response?.imageUrl;
    if (fb) return fb as string;
    if (post.image?.buffer) {
      const mime = post.image.mimetype || 'image/jpeg';
      return `data:${mime};base64,${post.image.buffer}`;
    }
    return null;
  }, [post]);

  const postData = useMemo(() => {
    return {
      content: post?.caption || '',
      files: imageSrc ? [{ url: imageSrc, type: 'image' as const }] : [],
    };
  }, [post?.caption, imageSrc]);

  // Build lightweight connection/status objects from stored accounts
  const buildStatusByPlatform = () => {
    const accounts = Array.isArray(post?.accounts) ? post!.accounts : [];
    const findAcc = (p: string) => accounts.find(a => a.platform === p);
    return {
      facebook: (() => {
        const a = findAcc('facebook');
        return a ? { connected: true, pages: [{ name: a.name, picture: a.profileImage, category: 'Page' }] } : { connected: false };
      })(),
      instagram: (() => {
        const a = findAcc('instagram');
        return a ? { connected: true, profile: { username: a.username || a.name, account_type: 'Business', profilePicture: a.profileImage } } : { connected: false };
      })(),
      linkedin: (() => {
        const a = findAcc('linkedin');
        return a ? { connected: true, profile: { name: a.name, email: '', profilePicture: a.profileImage } } : { connected: false };
      })(),
      twitter: (() => {
        const a = findAcc('twitter') || findAcc('x');
        return a ? { connected: true, profile: { name: a.name, screen_name: a.username, profilePicture: a.profileImage } } : { connected: false };
      })(),
    };
  };
  const statusByPlatform = buildStatusByPlatform();

  if (!post) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  const dateToUse = post.publishedAt || post.scheduledAt;
  const meta = STATUS_META[post.status];
  const StatusIcon = meta.icon;

  return (
    <div className="w-full">
      {/* Top Status Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${meta.bg} ${meta.color} font-semibold text-xs ring-1 ${meta.ring}`}>
            <StatusIcon className="w-3 h-3" />
            <span className="uppercase tracking-widest">{meta.name}</span>
          </div>
          <div className="text-sm text-white/70 flex items-center gap-2">
            <FaRegCalendarAlt className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-white/50">{post.status === 'scheduled' ? 'Scheduled' : 'Published'}</span>
            <span className="font-semibold text-white">{dateToUse ? `${formatDateDDMonYYYY(dateToUse)} at ${formatTimeHHmm(dateToUse)}` : '—'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Platform-specific Previews (span 3) */}
        <div className="lg:col-span-3 space-y-6">
          {post.platforms?.map((p) => (
            <div key={p} className="bg-[#151515] border border-white/10 rounded-xl p-4">
              <div className="text-white/70 text-xs mb-3 uppercase tracking-wider">{p} preview</div>
              {p === 'facebook' && (
                <FacebookPreview selectedDevice="desktop" facebookStatus={statusByPlatform.facebook} postData={postData} />
              )}
              {(p === 'instagram') && (
                <InstagramPreview selectedDevice="desktop" instagramStatus={statusByPlatform.instagram} isLoadingInstagram={false} postData={postData} />
              )}
              {(p === 'linkedin') && (
                <LinkedInPreview selectedDevice="desktop" linkedinStatus={statusByPlatform.linkedin} isLoadingLinkedIn={false} postData={postData} />
              )}
              {(p === 'twitter' || p === 'x') && (
                <TwitterPreview selectedDevice="desktop" twitterStatus={statusByPlatform.twitter} isLoadingTwitter={false} postData={postData} />
              )}
            </div>
          ))}
        </div>

        {/* Right: Details (span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timing */}
          <div className="bg-[#121216] border border-white/10 rounded-xl p-4 space-y-3">
            <h3 className="text-white font-semibold">Timing</h3>
            <div className="text-sm text-gray-300 flex items-center gap-2">
              <FaRegCalendarAlt className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-gray-400">{post.status === 'scheduled' ? 'Scheduled at:' : 'Published at:'}</span>
              <span className="font-semibold text-white">{dateToUse ? `${formatDateDDMonYYYY(dateToUse)} at ${formatTimeHHmm(dateToUse)}` : '—'}</span>
            </div>
          </div>

          {/* Platforms */}
          <div className="bg-[#121216] border border-white/10 rounded-xl p-4 space-y-4">
            <h3 className="text-white font-semibold">Platforms</h3>
            <div className="flex flex-wrap gap-2">
              {post.platforms?.map((p) => {
                const metaP = PLATFORM_META[p] || { icon: FaTwitter, color: '#9CA3AF', name: p };
                const Icon = metaP.icon;
                return (
                  <div key={p} className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1f] rounded-full border border-[#2c2c34]">
                    <Icon size={14} style={{ color: metaP.color }} />
                    <span className="text-gray-300 text-xs font-medium uppercase tracking-wider">{metaP.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Accounts */}
          {Array.isArray(post.accounts) && post.accounts.length > 0 && (
            <div className="bg-[#121216] border border-white/10 rounded-xl p-4 space-y-3">
              <h3 className="text-white font-semibold">Accounts</h3>
              <div className="space-y-3">
                {post.accounts.map((acc, idx) => {
                  const metaP = PLATFORM_META[acc.platform] || { icon: FaTwitter, color: '#9CA3AF', name: acc.platform };
                  const Icon = metaP.icon;
                  const initials = (acc.name || acc.username || metaP.name || '?').trim().charAt(0).toUpperCase();
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
                          <div className="text-gray-400 text-xs truncate flex items-center gap-2">
                            {acc.username ? `@${acc.username.replace(/^@/, '')}` : metaP.name}
                            <a className="text-indigo-400 hover:text-indigo-300 transition-colors" href="#" title="View account">↗</a>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon size={14} style={{ color: metaP.color }} />
                        <span className="text-gray-400 text-xs uppercase tracking-wider">{metaP.name}</span>
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
  );
};

export default PostDetailsView;
