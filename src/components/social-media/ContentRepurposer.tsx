import React, { useEffect, useState } from 'react';
import { FiCopy, FiCheck, FiLoader, FiChevronDown, FiChevronUp, FiRefreshCw } from 'react-icons/fi';
import { FaInstagram, FaFacebook, FaLinkedin, FaTwitter, FaVideo, FaBlog } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { socialMediaService } from '../../services/social-media/ai-content';
import type { RepurposeVariants, BrandVoice } from '../../types/social-media';
import LoadingSpinner from '../LoadingSpinner';

const VARIANT_META: Array<{ key: keyof RepurposeVariants; label: string; icon: React.ReactNode; color: string }> = [
  { key: 'instagram', label: 'Instagram', icon: <FaInstagram />, color: 'text-[#E4405F]' },
  { key: 'facebook', label: 'Facebook', icon: <FaFacebook />, color: 'text-[#1877F2]' },
  { key: 'linkedin', label: 'LinkedIn', icon: <FaLinkedin />, color: 'text-[#0A66C2]' },
  { key: 'shortForm', label: 'X (Twitter)', icon: <FaTwitter />, color: 'text-[#1DA1F2]' },
  { key: 'reelScript', label: 'Reel / Video Script', icon: <FaVideo />, color: 'text-[#DE0500]' },
  { key: 'blog', label: 'Blog Opening', icon: <FaBlog />, color: 'text-emerald-400' },
];

const VariantCard: React.FC<{ label: string; icon: React.ReactNode; color: string; text: string }> = ({ label, icon, color, text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="bg-[#151515] border border-gray-800 rounded-xl p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`flex items-center gap-2 text-sm font-semibold ${color}`}>
          <span className="text-base">{icon}</span>
          {label}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-white/5"
        >
          {copied ? <FiCheck className="w-3.5 h-3.5 text-emerald-400" /> : <FiCopy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{text}</p>
    </div>
  );
};

const ContentRepurposer: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<RepurposeVariants | null>(null);

  const [voiceOpen, setVoiceOpen] = useState(false);
  const [voice, setVoice] = useState<BrandVoice>({});
  const [voiceLoaded, setVoiceLoaded] = useState(false);
  const [savingVoice, setSavingVoice] = useState(false);

  useEffect(() => {
    socialMediaService.getBrandVoice().then((res) => {
      if (res.success && res.data) setVoice(res.data);
      setVoiceLoaded(true);
    });
  }, []);

  const handleSaveVoice = async () => {
    setSavingVoice(true);
    const res = await socialMediaService.saveBrandVoice(voice);
    setSavingVoice(false);
    if (res.success) {
      toast.success('Brand voice saved — future repurposing will use it');
    } else {
      toast.error(res.message || 'Failed to save brand voice');
    }
  };

  const handleRepurpose = async () => {
    if (!input.trim()) {
      toast.error('Add an idea or existing content to repurpose first');
      return;
    }
    setLoading(true);
    setVariants(null);
    const res = await socialMediaService.repurposeWithAI({ input });
    setLoading(false);
    if (res.success && res.data) {
      setVariants(res.data.variants);
    } else {
      toast.error(res.message || 'Failed to repurpose content');
    }
  };

  const hasVoiceSet = !!(voice.businessName || voice.tone || voice.description);

  return (
    <div className="w-full rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-white text-lg md:text-xl font-bold">Content Repurposing</h2>
      </div>
      <p className="text-gray-500 text-xs sm:text-sm mb-4">
        One idea, six formats — Instagram, Facebook, LinkedIn, X, a Reel/video script, and a blog opening.
      </p>

      {/* Brand voice (optional, collapsible) */}
      <div className="mb-4 border border-gray-800 rounded-xl overflow-hidden">
        <button
          onClick={() => setVoiceOpen((v) => !v)}
          className="w-full flex items-center justify-between px-3 sm:px-4 py-3 bg-[#151515] hover:bg-[#1a1a1a] transition-colors"
        >
          <span className="text-sm font-semibold text-white">
            Brand Voice {hasVoiceSet ? <span className="text-emerald-400 font-normal">· set</span> : <span className="text-gray-500 font-normal">· optional</span>}
          </span>
          {voiceOpen ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
        </button>
        {voiceOpen && (
          <div className="p-3 sm:p-4 bg-[#101010] space-y-3">
            {!voiceLoaded ? (
              <div className="flex justify-center py-4"><LoadingSpinner variant="dark" size="small" /></div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    value={voice.businessName || ''}
                    onChange={(e) => setVoice((v) => ({ ...v, businessName: e.target.value }))}
                    placeholder="Business name"
                    className="bg-[#1E1E1E] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                  />
                  <input
                    value={voice.industry || ''}
                    onChange={(e) => setVoice((v) => ({ ...v, industry: e.target.value }))}
                    placeholder="Industry"
                    className="bg-[#1E1E1E] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                  />
                </div>
                <input
                  value={voice.tone || ''}
                  onChange={(e) => setVoice((v) => ({ ...v, tone: e.target.value }))}
                  placeholder="Tone (e.g. professional and friendly, bold and witty)"
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                />
                <input
                  value={voice.targetAudience || ''}
                  onChange={(e) => setVoice((v) => ({ ...v, targetAudience: e.target.value }))}
                  placeholder="Target audience"
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                />
                <textarea
                  value={voice.description || ''}
                  onChange={(e) => setVoice((v) => ({ ...v, description: e.target.value }))}
                  placeholder="What does your business do?"
                  rows={2}
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 resize-none"
                />
                <input
                  value={(voice.keywords || []).join(', ')}
                  onChange={(e) => setVoice((v) => ({ ...v, keywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean) }))}
                  placeholder="Keywords/themes, comma separated"
                  className="w-full bg-[#1E1E1E] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                />
                <button
                  onClick={handleSaveVoice}
                  disabled={savingVoice}
                  className="inline-flex items-center gap-2 bg-[#DE0500] hover:bg-[#b00400] disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                >
                  {savingVoice && <FiLoader className="w-3.5 h-3.5 animate-spin" />}
                  Save Brand Voice
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste an idea, a draft, or existing content to repurpose across every platform..."
        rows={3}
        className="w-full bg-[#1E1E1E] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 resize-none mb-3"
      />

      <button
        onClick={handleRepurpose}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 bg-[#DE0500] hover:bg-[#b00400] disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors w-full sm:w-auto"
      >
        {loading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiRefreshCw className="w-4 h-4" />}
        {loading ? 'Repurposing...' : 'Repurpose Content'}
      </button>

      {variants && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
          {VARIANT_META.map((m) => (
            <VariantCard key={m.key} label={m.label} icon={m.icon} color={m.color} text={variants[m.key]} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentRepurposer;
