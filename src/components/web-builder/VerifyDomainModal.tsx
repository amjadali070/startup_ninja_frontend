import React, { useState } from 'react';
import { FiCheckCircle, FiRefreshCw, FiCopy, FiInfo, FiTrash2, FiShield } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import WebBuilderService from '../../services/web-builder/WebBuilderService';
import AlertModal from '../AlertModal';
import IconSelect from '../IconSelect';

interface VerifyDomainModalProps {
    isOpen: boolean;
    onClose: () => void;
    website: any;
    onUpdate: () => void;
}

const VerifyDomainModal: React.FC<VerifyDomainModalProps> = ({ isOpen, onClose, website, onUpdate }) => {
    const [verifying, setVerifying] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDisconnectAlert, setShowDisconnectAlert] = useState(false);
    const [autoConfiguring, setAutoConfiguring] = useState(false);
    const [selectedRegistrar, setSelectedRegistrar] = useState<'godaddy' | 'namecheap'>('godaddy');

    if (!isOpen) return null;

    const handleAutoConfigure = async () => {
        setAutoConfiguring(true);
        try {
            const response = await WebBuilderService.autoConfigureDns(website.userId, website._id, selectedRegistrar);
            if (response.success) {
                toast.success(response.message);
                // DNS was just set programmatically — worth an immediate check,
                // though real-world propagation can still take a few minutes.
                await handleVerify();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Automatic DNS setup failed.");
        } finally {
            setAutoConfiguring(false);
        }
    };

    const handleVerify = async () => {
        setVerifying(true);
        try {
            const response = await WebBuilderService.verifyDomain(website.userId, website._id);
            if (response.success) {
                if (response.data.status === 'verified') {
                    toast.success("Domain verified successfully!");
                    // Used to auto-close 1.5s after this — too fast to actually
                    // read the SSL-provisioning explanation below, which is the
                    // whole point of showing it. Let the user dismiss it via
                    // "Done" once they've actually read it, same as every other
                    // modal in this app.
                } else {
                    toast.error("Verification failed. Please ensure your DNS records are correct.");
                }
                onUpdate();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Failed to verify domain.");
        } finally {
            setVerifying(false);
        }
    };

    const handleDisconnect = async () => {
        setLoading(true);
        try {
            const response = await WebBuilderService.disconnectDomain(website.userId, website._id);
            if (response.success) {
                toast.success("Domain disconnected successfully.");
                setShowDisconnectAlert(false);
                onUpdate();
                onClose();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Failed to disconnect domain.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const systemDomain = import.meta.env.VITE_SYSTEM_BASE_DOMAIN || "localhost";
    const systemIp = import.meta.env.VITE_SYSTEM_IP || "127.0.0.1";

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70">
            {/* max-h-[90vh] + flex-col here, with the body below scrolling
                independently, so this long form (status card, DNS info,
                auto-DNS section, CNAME/A records, verify button, footer
                text) doesn't get clipped off-screen on short mobile
                viewports the way an unbounded height would. */}
            <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-[#333] flex justify-between items-center bg-[#222] shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                            <FiShield className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">Verify Domain</h3>
                            <p className="text-gray-400 text-xs">Verify your DNS records to activate domain</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto">
                    {/* Domain Status Card */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#0b0b0b] border border-[#333]">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Domain Name</p>
                            <p className="text-white font-mono font-bold text-lg">{website.customDomain}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {website.customDomainStatus === 'verified' ? (
                                <span className="flex items-center gap-1.5 text-green-500 text-sm font-bold bg-green-500/10 px-3 py-1 rounded-full">
                                    <FiCheckCircle /> Verified
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-yellow-500 text-sm font-bold bg-yellow-500/10 px-3 py-1 rounded-full">
                                    <FiRefreshCw className="animate-spin-slow" /> Pending
                                </span>
                            )}
                            <button
                                onClick={() => setShowDisconnectAlert(true)}
                                disabled={loading}
                                className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all disabled:opacity-50"
                                title="Disconnect Domain"
                            >
                                <FiTrash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {website.customDomainStatus !== 'verified' ? (
                        <>
                            <div className="flex items-start gap-3 p-4 bg-blue-500/5 rounded-xl border border-blue-500/20">
                                <FiInfo className="text-blue-400 w-5 h-5 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Almost there! Add the following record to your DNS provider (e.g. Cloudflare, GoDaddy). Note that propagation can take up to 24 hours.
                                </p>
                            </div>

                            {/* Automatic DNS setup — feedback.md: "Add GoDaddy and
                                Namecheap integrations where API access permits." No
                                registrar credentials are configured yet, so this
                                correctly reports "not available" and the manual
                                steps below stay the primary path; the button and
                                flow are real and ready for whenever credentials
                                exist. */}
                            <div className="p-4 bg-[#0b0b0b] rounded-xl border border-[#333] space-y-3">
                                <p className="text-xs text-gray-400">
                                    Registered with GoDaddy or Namecheap? We can try setting this up for you automatically.
                                </p>
                                <div className="flex gap-2">
                                    <IconSelect
                                        value={selectedRegistrar}
                                        onChange={(v) => setSelectedRegistrar(v as 'godaddy' | 'namecheap')}
                                        options={[
                                            { value: 'godaddy', label: 'GoDaddy' },
                                            { value: 'namecheap', label: 'Namecheap' },
                                        ]}
                                        className={`bg-[#131313] border border-[#333] rounded-lg px-3 h-10 text-sm text-white focus:outline-none focus:border-blue-500/50 ${autoConfiguring ? 'opacity-50 pointer-events-none' : ''}`}
                                    />
                                    <button
                                        onClick={handleAutoConfigure}
                                        disabled={autoConfiguring}
                                        className="flex-1 bg-[#252525] hover:bg-[#333] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        {autoConfiguring ? <FiRefreshCw className="animate-spin w-4 h-4" /> : null}
                                        {autoConfiguring ? "Configuring…" : "Set Up Automatically"}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="h-[1px] flex-1 bg-[#333]"></div>
                                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Or set up manually</span>
                                <div className="h-[1px] flex-1 bg-[#333]"></div>
                            </div>

                            <div className="space-y-4">
                                {/* CNAME Record */}
                                <div className="bg-[#0b0b0b] rounded-xl p-4 relative border border-[#333] hover:border-blue-500/30 transition-colors">
                                    <span className="absolute -top-2.5 left-4 bg-[#333] text-[10px] text-gray-300 px-2 py-0.5 rounded uppercase font-bold tracking-widest">CNAME Record</span>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Host / Name</p>
                                            <p className="text-sm text-white font-mono font-bold">www</p>
                                        </div>
                                        <div className="space-y-1 text-center flex-1 min-w-0 px-2">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Points To (Value)</p>
                                            <p className="text-sm text-white font-mono truncate" title={systemDomain}>{systemDomain}</p>
                                        </div>
                                        <button 
                                            onClick={() => copyToClipboard(systemDomain)} 
                                            className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-all"
                                        >
                                            <FiCopy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="h-[1px] flex-1 bg-[#333]"></div>
                                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">OR</span>
                                    <div className="h-[1px] flex-1 bg-[#333]"></div>
                                </div>

                                {/* A Record */}
                                <div className="bg-[#0b0b0b] rounded-xl p-4 relative border border-[#333] hover:border-blue-500/30 transition-colors">
                                    <span className="absolute -top-2.5 left-4 bg-[#333] text-[10px] text-gray-300 px-2 py-0.5 rounded uppercase font-bold tracking-widest">A Record</span>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Host / Name</p>
                                            <p className="text-sm text-white font-mono font-bold">@</p>
                                        </div>
                                        <div className="space-y-1 text-center flex-1 min-w-0 px-2">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Points To (IP)</p>
                                            <p className="text-sm text-white font-mono truncate" title={systemIp}>{systemIp}</p>
                                        </div>
                                        <button 
                                            onClick={() => copyToClipboard(systemIp)} 
                                            className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-all"
                                        >
                                            <FiCopy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleVerify}
                                disabled={verifying}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20"
                            >
                                {verifying ? <FiRefreshCw className="animate-spin w-5 h-5" /> : <FiCheckCircle className="w-5 h-5" />}
                                {verifying ? 'Checking DNS Records...' : 'Verify DNS Records'}
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-6 animate-pulse">
                                <FiCheckCircle className="w-10 h-10" />
                            </div>
                            <h4 className="text-white text-xl font-bold">DNS Verified!</h4>
                            <p className="text-gray-400 text-sm mt-2 max-w-xs leading-relaxed">
                                Your domain now points to us correctly. A security certificate (HTTPS) is being issued for it automatically — this usually takes just a few minutes, occasionally longer. Your site will be reachable at your domain as soon as that finishes.
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-8 px-8 py-3 bg-[#333] hover:bg-[#444] text-white font-bold rounded-xl transition-all"
                            >
                                Done
                            </button>
                        </div>
                    )}

                    <p className="text-center text-[10px] text-gray-600 italic">
                        DNS changes update as fast as 5 minutes but can take 24-48 hours.
                    </p>
                </div>
            </div>

            {/* Disconnect Confirmation Alert */}
            <AlertModal
                isOpen={showDisconnectAlert}
                type="danger"
                action="delete"
                title="Disconnect Domain"
                message={
                    <div className="space-y-2">
                        <p>Are you sure you want to disconnect <strong className="text-white">{website.customDomain}</strong>?</p>
                        <p className="text-sm text-white/60">This action will remove the custom domain from your website. You can reconnect it later if needed.</p>
                    </div>
                }
                confirmText="Disconnect"
                cancelText="Cancel"
                onClose={() => setShowDisconnectAlert(false)}
                onConfirm={handleDisconnect}
                isLoading={loading}
                loadingText="Disconnecting..."
            />
        </div>
    );
};

export default VerifyDomainModal;
