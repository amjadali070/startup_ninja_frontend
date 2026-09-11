import React, { useState, useEffect } from 'react';
import { FiFile, FiPlus, FiTrash2, FiHome, FiEdit2, FiX, FiCheck } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import WebBuilderService from '../../services/web-builder/WebBuilderService';
import AlertModal from '../AlertModal';
import LoadingSpinner from '../LoadingSpinner';

interface Page {
    slug: string;
    title: string;
    pageData: any;
    isHome: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface PagesManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    website: any;
    onPageSelect?: (slug: string) => void;
    currentPageSlug?: string;
}

const PagesManagerModal: React.FC<PagesManagerModalProps> = ({ 
    isOpen, 
    onClose, 
    website,
    onPageSelect,
    currentPageSlug = 'index'
}) => {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAddPage, setShowAddPage] = useState(false);
    const [newPageTitle, setNewPageTitle] = useState('');
    const [newPageSlug, setNewPageSlug] = useState('');
    const [deletePageSlug, setDeletePageSlug] = useState<string | null>(null);
    const [editingPage, setEditingPage] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');

    useEffect(() => {
        if (isOpen && website) {
            fetchPages();
        }
    }, [isOpen, website]);

    const fetchPages = async () => {
        setLoading(true);
        try {
            const response = await WebBuilderService.getPages(website.userId, website._id);
            if (response.success) {
                setPages(response.data || []);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Failed to load pages");
        } finally {
            setLoading(false);
        }
    };

    const handleAddPage = async () => {
        if (!newPageTitle.trim() || !newPageSlug.trim()) {
            toast.error("Please enter both title and slug");
            return;
        }

        // Validate slug format
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(newPageSlug)) {
            toast.error("Slug can only contain lowercase letters, numbers, and hyphens");
            return;
        }

        setLoading(true);
        try {
            const response = await WebBuilderService.createPage(
                website.userId,
                website._id,
                newPageSlug,
                newPageTitle
            );

            if (response.success) {
                toast.success("Page created successfully!");
                setNewPageTitle('');
                setNewPageSlug('');
                setShowAddPage(false);
                fetchPages();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Failed to create page");
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePage = async () => {
        if (!deletePageSlug) return;

        setLoading(true);
        try {
            const response = await WebBuilderService.deletePage(
                website.userId,
                website._id,
                deletePageSlug
            );

            if (response.success) {
                toast.success("Page deleted successfully!");
                setDeletePageSlug(null);
                fetchPages();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Failed to delete page");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTitle = async (slug: string) => {
        if (!editTitle.trim()) {
            toast.error("Title cannot be empty");
            return;
        }

        setLoading(true);
        try {
            const response = await WebBuilderService.updatePage(
                website.userId,
                website._id,
                slug,
                editTitle
            );

            if (response.success) {
                toast.success("Page title updated!");
                setEditingPage(null);
                setEditTitle('');
                fetchPages();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("Failed to update page");
        } finally {
            setLoading(false);
        }
    };

    const generateSlugFromTitle = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70">
                {/* max-h-[90vh] + flex-col, body scrolling independently below —
                    a fixed max-h-[600px] on the body could still exceed a short
                    mobile viewport's total height once the header is added on
                    top of it. */}
                <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-[#333] flex justify-between items-center bg-[#222] shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <FiFile className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">Pages Manager</h3>
                                <p className="text-gray-400 text-xs">Manage your website pages</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            ✕
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto">
                        {/* Add New Page Section */}
                        {!showAddPage ? (
                            <button
                                onClick={() => setShowAddPage(true)}
                                className="w-full p-4 border-2 border-dashed border-[#333] hover:border-blue-500/50 rounded-xl transition-all flex items-center justify-center gap-2 text-gray-400 hover:text-blue-400 group"
                            >
                                <FiPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Add New Page</span>
                            </button>
                        ) : (
                            <div className="p-4 bg-[#0b0b0b] border border-blue-500/30 rounded-xl space-y-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-white font-bold text-sm">Create New Page</h4>
                                    <button
                                        onClick={() => {
                                            setShowAddPage(false);
                                            setNewPageTitle('');
                                            setNewPageSlug('');
                                        }}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <FiX className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
                                            Page Title
                                        </label>
                                        <input
                                            type="text"
                                            value={newPageTitle}
                                            onChange={(e) => {
                                                setNewPageTitle(e.target.value);
                                                if (!newPageSlug) {
                                                    setNewPageSlug(generateSlugFromTitle(e.target.value));
                                                }
                                            }}
                                            placeholder="About Us"
                                            className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">
                                            URL Slug
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500 text-sm">/</span>
                                            <input
                                                type="text"
                                                value={newPageSlug}
                                                onChange={(e) => setNewPageSlug(e.target.value.toLowerCase())}
                                                placeholder="about-us"
                                                className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors font-mono text-sm"
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-1 italic">
                                            Use lowercase letters, numbers, and hyphens only
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddPage}
                                    disabled={loading || !newPageTitle || !newPageSlug}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <FiCheck className="w-4 h-4" />
                                    Create Page
                                </button>
                            </div>
                        )}

                        {/* Pages List */}
                        <div className="space-y-3 mt-6">
                            <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">
                                All Pages ({pages.length})
                            </h4>
                            {loading && pages.length === 0 ? (
                                <div className="py-12">
                                    <LoadingSpinner size="small" variant="dark" />
                                </div>
                            ) : pages.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <FiFile className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p>No pages yet. Create your first page!</p>
                                </div>
                            ) : (
                                pages.map((page) => (
                                    <div
                                        key={page.slug}
                                        className={`p-4 rounded-xl border transition-all ${
                                            currentPageSlug === page.slug
                                                ? 'bg-blue-500/10 border-blue-500/50'
                                                : 'bg-[#0b0b0b] border-[#333] hover:border-[#444]'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                    page.isHome ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-400'
                                                }`}>
                                                    {page.isHome ? <FiHome className="w-5 h-5" /> : <FiFile className="w-5 h-5" />}
                                                </div>
                                                <div className="flex-1">
                                                    {editingPage === page.slug ? (
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                value={editTitle}
                                                                onChange={(e) => setEditTitle(e.target.value)}
                                                                className="flex-1 bg-[#1a1a1a] border border-blue-500/50 rounded px-2 py-1 text-white text-sm focus:outline-none"
                                                                autoFocus
                                                            />
                                                            <button
                                                                onClick={() => handleUpdateTitle(page.slug)}
                                                                className="p-1.5 bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white rounded transition-all"
                                                            >
                                                                <FiCheck className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingPage(null);
                                                                    setEditTitle('');
                                                                }}
                                                                className="p-1.5 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded transition-all"
                                                            >
                                                                <FiX className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="flex items-center gap-2">
                                                                <h5 className="text-white font-bold text-sm">{page.title}</h5>
                                                                {page.isHome && (
                                                                    <span className="text-[9px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                                        Home
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-gray-500 text-xs font-mono">/{page.slug}</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {onPageSelect && (
                                                    <button
                                                        onClick={() => {
                                                            onPageSelect(page.slug);
                                                            onClose();
                                                        }}
                                                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                                            currentPageSlug === page.slug
                                                                ? 'bg-blue-500 text-white'
                                                                : 'bg-[#333] text-gray-300 hover:bg-[#444]'
                                                        }`}
                                                    >
                                                        {currentPageSlug === page.slug ? 'Editing' : 'Edit'}
                                                    </button>
                                                )}
                                                {!page.isHome && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setEditingPage(page.slug);
                                                                setEditTitle(page.title);
                                                            }}
                                                            className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition-all"
                                                            title="Rename Page"
                                                        >
                                                            <FiEdit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setDeletePageSlug(page.slug)}
                                                            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                                            title="Delete Page"
                                                        >
                                                            <FiTrash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation */}
            <AlertModal
                isOpen={!!deletePageSlug}
                type="danger"
                action="delete"
                title="Delete Page"
                message={
                    <div className="space-y-2">
                        <p>Are you sure you want to delete this page?</p>
                        <p className="text-sm text-white/60">This action cannot be undone. All content on this page will be permanently lost.</p>
                    </div>
                }
                confirmText="Delete Page"
                cancelText="Cancel"
                onClose={() => setDeletePageSlug(null)}
                onConfirm={handleDeletePage}
                isLoading={loading}
                loadingText="Deleting..."
            />
        </>
    );
};

export default PagesManagerModal;
