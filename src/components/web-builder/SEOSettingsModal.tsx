import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiSave, FiAlertCircle, FiImage, FiEye, FiRefreshCw, FiUploadCloud, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import WebBuilderService, { SEOSettings } from '../../services/web-builder/WebBuilderService';

interface SEOSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    website: any;
    onUpdate: () => void;
}

const SEOSettingsModal: React.FC<SEOSettingsModalProps> = ({ isOpen, onClose, website, onUpdate }) => {
    const [settings, setSettings] = useState<SEOSettings>({
        title: '',
        description: '',
        keywords: '',
        author: '',
        ogImage: '',
        favicon: '',
        isNoIndex: false
    });
    const [loading, setLoading] = useState(false);
    const [uploadingFavicon, setUploadingFavicon] = useState(false);
    const faviconInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (website?.seoSettings) {
            setSettings({
                title: website.seoSettings.title || '',
                description: website.seoSettings.description || '',
                keywords: website.seoSettings.keywords || '',
                author: website.seoSettings.author || '',
                ogImage: website.seoSettings.ogImage || '',
                favicon: website.seoSettings.favicon || '',
                isNoIndex: !!website.seoSettings.isNoIndex
            });
        } else {
             setSettings({
                title: website?.websiteTitle || '',
                description: website?.websiteDescription || '',
                keywords: '',
                author: '',
                ogImage: '',
                favicon: '',
                isNoIndex: false
            });
        }
    }, [website, isOpen]);

    if (!isOpen) return null;

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await WebBuilderService.updateSEO(website.userId, website._id, settings);
            if (response.success) {
                toast.success("SEO settings updated successfully!");
                onUpdate();
                onClose();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Failed to update SEO settings.");
        } finally {
            setLoading(false);
        }
    };

    const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Simple validation
        const allowedTypes = ['image/x-icon', 'image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Invalid file type. Please upload an .ico, .png, .jpg, or .svg file.");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error("File size too large. Max limit is 2MB.");
            return;
        }

        setUploadingFavicon(true);
        try {
            const response = await WebBuilderService.uploadFavicon(website.userId, website._id, file);
            if (response.success) {
                setSettings(prev => ({ ...prev, favicon: response.data.favicon }));
                toast.success("Favicon uploaded and saved!");
                onUpdate();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Failed to upload favicon.");
        } finally {
            setUploadingFavicon(false);
        }
    };

    const handleRemoveFavicon = () => {
        setSettings(prev => ({ ...prev, favicon: '' }));
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-[#333] flex justify-between items-center bg-[#222]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <FiSearch className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">SEO & Branding</h3>
                            <p className="text-gray-400 text-xs">Optimize your website and customize branding</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        ✕
                    </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-6">
                        {/* Branding Section (Favicon) */}
                        <div className="p-4 bg-[#222] border border-[#333] rounded-xl flex items-center gap-6">
                            <div className="flex-shrink-0">
                                <label className="block text-gray-400 text-xs font-medium mb-2 uppercase tracking-wider">Favicon</label>
                                <div className="w-16 h-16 rounded-lg bg-[#0b0b0b] border border-[#333] flex items-center justify-center relative group overflow-hidden">
                                    {settings.favicon ? (
                                        <img src={settings.favicon} alt="Favicon" className="w-10 h-10 object-contain" />
                                    ) : (
                                        <img src="https://startupninja.ai/favicon.ico" alt="Default" className="w-10 h-10 object-contain opacity-40" />
                                    )}
                                    {uploadingFavicon && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <FiRefreshCw className="animate-spin text-white w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1">
                                <h5 className="text-white text-sm font-semibold mb-1">Website Icon</h5>
                                <p className="text-gray-400 text-[10px] mb-3 leading-relaxed">
                                    This icon will appear in browser tabs and bookmarks. Recommended size: 32x32px (.ico or .png).
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        ref={faviconInputRef}
                                        onChange={handleFaviconUpload}
                                        className="hidden"
                                        accept=".ico,.png,.jpg,.jpeg,.svg,.webp"
                                    />
                                    <button
                                        onClick={() => faviconInputRef.current?.click()}
                                        disabled={uploadingFavicon}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-all"
                                    >
                                        <FiUploadCloud /> Upload New
                                    </button>
                                    {settings.favicon && (
                                        <button
                                            onClick={handleRemoveFavicon}
                                            className="px-3 py-1.5 bg-[#333] hover:bg-red-900/40 text-gray-400 hover:text-red-400 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5"
                                        >
                                            <FiTrash2 /> Reset
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Page Title */}
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">Meta Title</label>
                            <input
                                type="text"
                                value={settings.title}
                                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                                placeholder="The title shown in search results"
                                className="w-full bg-[#0b0b0b] border border-[#333] rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                            <p className="text-[10px] text-gray-500 mt-1">Recommended: 50-60 characters</p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">Meta Description</label>
                            <textarea
                                value={settings.description}
                                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                                placeholder="A brief summary of your page content"
                                rows={3}
                                className="w-full bg-[#0b0b0b] border border-[#333] rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                            />
                            <p className="text-[10px] text-gray-500 mt-1">Recommended: 150-160 characters</p>
                        </div>

                        {/* Keywords */}
                        <div>
                            <label className="block text-gray-400 text-sm font-medium mb-2">Keywords</label>
                            <input
                                type="text"
                                value={settings.keywords}
                                onChange={(e) => setSettings({ ...settings, keywords: e.target.value })}
                                placeholder="keyword1, keyword2, keyword3"
                                className="w-full bg-[#0b0b0b] border border-[#333] rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Author */}
                            <div>
                                <label className="block text-gray-400 text-sm font-medium mb-2">Author</label>
                                <input
                                    type="text"
                                    value={settings.author}
                                    onChange={(e) => setSettings({ ...settings, author: e.target.value })}
                                    placeholder="Your name or brand"
                                    className="w-full bg-[#0b0b0b] border border-[#333] rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                            </div>

                            {/* OG Image */}
                            <div>
                                <label className="block text-gray-400 text-sm font-medium mb-2">Social Share Image (URL)</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={settings.ogImage || ''}
                                        onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                                        placeholder="https://example.com/image.png"
                                        className="w-full bg-[#0b0b0b] border border-[#333] rounded-lg px-4 py-2.5 pl-10 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                                    />
                                    <FiImage className="absolute left-3 top-3.5 text-gray-500" />
                                </div>
                            </div>
                        </div>

                        {/* No Index Toggle */}
                        <div className="flex items-center justify-between p-4 bg-[#222] border border-[#333] rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                                    <FiAlertCircle className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-semibold">Hide from search engines</p>
                                    <p className="text-gray-400 text-[10px]">Tells bots not to index this site (noindex)</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, isNoIndex: !settings.isNoIndex })}
                                className={`w-12 h-6 rounded-full transition-all relative ${settings.isNoIndex ? 'bg-red-500' : 'bg-[#333]'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.isNoIndex ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="mt-8">
                        <label className="block text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
                            <FiEye className="w-4 h-4" /> Google Preview
                        </label>
                        <div className="bg-white rounded-xl p-5 shadow-inner">
                            <p className="text-[#1a0dab] text-xl font-normal mb-1 truncate hover:underline cursor-pointer">
                                {settings.title || website?.websiteTitle || 'Website Title'}
                            </p>
                            <p className="text-[#006621] text-sm mb-1 truncate">
                                {website?.customDomain ? `https://${website.publishedLink}` : 'https://yourwebsite.startupninja.ai'}
                            </p>
                            <p className="text-[#545454] text-sm line-clamp-2 leading-relaxed">
                                {settings.description || 'Description of your website will appear here when search engines index your site.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[#333] flex justify-end gap-3 bg-[#222]">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading || uploadingFavicon}
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

export default SEOSettingsModal;

