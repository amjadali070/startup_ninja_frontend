import React, { useState, useEffect } from 'react';
import { FiShare2, FiSave, FiRefreshCw, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube } from 'react-icons/fi';
import { SiTiktok } from 'react-icons/si';
import { toast } from 'react-hot-toast';
import WebBuilderService, { SocialLinks } from '../../services/web-builder/WebBuilderService';

interface SocialLinksModalProps {
    isOpen: boolean;
    onClose: () => void;
    website: any;
    onUpdate: () => void;
}

const PLATFORMS: Array<{ key: keyof SocialLinks; label: string; placeholder: string; icon: React.ReactNode }> = [
    { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourpage', icon: <FiFacebook /> },
    { key: 'twitter', label: 'Twitter / X', placeholder: 'https://x.com/yourhandle', icon: <FiTwitter /> },
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourhandle', icon: <FiInstagram /> },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yours', icon: <FiLinkedin /> },
    { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@yourchannel', icon: <FiYoutube /> },
    { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@yourhandle', icon: <SiTiktok /> },
];

const EMPTY_LINKS: SocialLinks = { facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '', tiktok: '' };

const SocialLinksModal: React.FC<SocialLinksModalProps> = ({ isOpen, onClose, website, onUpdate }) => {
    const [links, setLinks] = useState<SocialLinks>(EMPTY_LINKS);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLinks({ ...EMPTY_LINKS, ...(website?.socialLinks || {}) });
    }, [website, isOpen]);

    if (!isOpen) return null;

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await WebBuilderService.updateSocialLinks(website.userId, website._id, links);
            if (response.success) {
                toast.success("Social links updated — they'll appear on your next publish.");
                onUpdate();
                onClose();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Failed to update social links.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-[#333] flex justify-between items-center bg-[#222]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <FiShare2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">Social Links</h3>
                            <p className="text-gray-400 text-xs">Set these once — applied to every "Social Links" block on the site</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        ✕
                    </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-4">
                    {PLATFORMS.map((p) => (
                        <div key={p.key}>
                            <label className="block text-gray-400 text-sm font-medium mb-2 flex items-center gap-2">
                                {p.icon} {p.label}
                            </label>
                            <input
                                type="text"
                                value={links[p.key] || ''}
                                onChange={(e) => setLinks({ ...links, [p.key]: e.target.value })}
                                placeholder={p.placeholder}
                                className="w-full bg-[#0b0b0b] border border-[#333] rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                        </div>
                    ))}
                    <p className="text-[10px] text-gray-500">
                        Leave a field blank to leave that platform's link untouched on the canvas — only platforms you fill in here get updated.
                    </p>
                </div>

                <div className="p-6 border-t border-[#333] flex justify-end gap-3 bg-[#222]">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-8 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20"
                    >
                        {loading ? <FiRefreshCw className="animate-spin" /> : <FiSave />}
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SocialLinksModal;
