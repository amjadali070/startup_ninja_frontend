import React, { useState, useEffect } from 'react';
import { FiGlobe, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import WebBuilderService from '../../services/web-builder/WebBuilderService';

interface DomainSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    website: any;
    onUpdate: () => void;
    onConnectedSuccess: () => void;
}

const DomainSettingsModal: React.FC<DomainSettingsModalProps> = ({ isOpen, onClose, website, onUpdate, onConnectedSuccess }) => {
    const [domain, setDomain] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (website?.customDomain) {
            setDomain(website.customDomain);
        } else {
            setDomain('');
        }
    }, [website, isOpen]);

    if (!isOpen) return null;

    const handleConnect = async () => {
        if (!domain) {
            toast.error("Please enter a domain name.");
            return;
        }

        // Basic validation
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](\.[a-zA-Z0-9-]{1,61})+$/;
        if (!domainRegex.test(domain)) {
            toast.error("Please enter a valid domain format (e.g. example.com)");
            return;
        }

        setLoading(true);
        try {
            const response = await WebBuilderService.connectDomain(website.userId, website._id, domain);
            if (response.success) {
                toast.success("Domain connected! Next: Verify DNS.");
                onUpdate();
                onConnectedSuccess();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Failed to connect domain.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-[#333] flex justify-between items-center bg-[#222]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                            <FiGlobe className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">Connect Domain</h3>
                            <p className="text-gray-400 text-xs">Use your own professional branding</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Domain Name</label>
                        <input
                            type="text"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            placeholder="yourbrand.com"
                            className="w-full bg-[#0b0b0b] border border-[#333] rounded-xl px-4 py-4 text-white text-lg placeholder:text-gray-700 focus:outline-none focus:border-red-500/50 transition-all shadow-inner"
                        />
                        <div className="flex items-start gap-2 mt-3 p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                            <FiAlertCircle className="text-red-500/50 w-4 h-4 mt-0.5 flex-shrink-0" />
                            <p className="text-[10px] text-gray-500 leading-relaxed italic">
                                Note: You only need to enter the domain (e.g. startupninja.ai). Do not include http:// or https://.
                            </p>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={handleConnect}
                            disabled={loading || !domain}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
                        >
                            {loading ? <FiRefreshCw className="animate-spin" /> : <FiGlobe />}
                            {loading ? 'Connecting Domain...' : 'Connect Domain'}
                        </button>
                    </div>

                    <p className="text-center text-[10px] text-gray-600 font-medium">
                        By connecting, you agree to our terms of domain mapping.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DomainSettingsModal;
