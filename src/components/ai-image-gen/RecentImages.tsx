import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
  FiDownload,
  FiX,
  FiCopy,
  FiImage,
  FiLoader,
  FiEdit3,
  FiShuffle,
  FiColumns,
  FiLayers,
} from "react-icons/fi";
import {
  imageGenService,
  GeneratedImage,
} from "../../services/imageGenService";
import { toast } from "react-hot-toast";
import AlertModal from "../AlertModal";
import LoadingSpinner from "../LoadingSpinner";

type RecentImagesProps = {
  shouldRefresh?: boolean;
};

type PreparedImageItem = {
  id: string;
  src: string;
  alt: string;
  prompt: string;
  createdAt: string;
  rootImageId: string;
  parentImageId: string | null;
  versionNumber: number;
  versionType: "original" | "edit" | "variation";
  editInstruction: string | null;
  versionCount?: number;
};

// The real API response never actually populates localPath — fall back to deriving the
// filename from imageUrl (always present), matching FileUpload.tsx's equivalent selector.
// A relative path (not an absolute http://localhost:5000 URL) is used for <img src> because
// the browser blocks an absolute cross-origin/cross-scheme resource load
// (ERR_BLOCKED_BY_RESPONSE.NotSameOrigin); Vite's dev proxy and the production reverse proxy
// both forward /api the same way every other API call in this app already does.
function toPreparedImage(img: GeneratedImage): PreparedImageItem {
  const filename = img.localPath
    ? img.localPath.split(/[/\\]/).pop()
    : img.imageUrl?.split("/").pop();
  const src = filename ? `/api/imaginative/image/${filename}` : img.imageUrl;
  const createdAtDate = new Date(img.createdAt);

  return {
    id: img._id,
    src,
    alt: img.prompt,
    prompt: img.prompt,
    createdAt: Number.isNaN(createdAtDate.getTime()) ? "-" : createdAtDate.toLocaleDateString(),
    rootImageId: img.rootImageId || img._id,
    parentImageId: img.parentImageId || null,
    versionNumber: img.versionNumber || 1,
    versionType: img.versionType || "original",
    editInstruction: img.editInstruction || null,
    versionCount: img.versionCount,
  };
}

const VERSION_TYPE_LABEL: Record<PreparedImageItem["versionType"], string> = {
  original: "Original",
  edit: "Edit",
  variation: "Variation",
};

// Switching versions can take a moment to actually load the new image bytes (proxied through
// the gateway and imaginative-service from S3) — without an explicit loading state, the
// PREVIOUS version's fully-rendered <img> just stays on screen during that gap, which looks
// identical to "the wrong version is showing." Keying on `src` + a spinner while it loads
// makes the transition unambiguous instead of silently leaving stale content visible.
const VersionImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <div className="relative w-full h-full min-h-0">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <FiLoader className="w-6 h-6 text-gray-500 animate-spin" />
        </div>
      )}
      <img
        key={src}
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`${className || ""} transition-opacity duration-150 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
};

// Modal Component
const ImageDetailModal: React.FC<{
  image: PreparedImageItem | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onDownload: (imageId: string, filename: string) => void;
  isDownloading: boolean;
  onLineageChanged: () => void;
}> = ({ image, onClose, onDelete, onDownload, isDownloading, onLineageChanged }) => {
  const [versions, setVersions] = useState<PreparedImageItem[]>(image ? [image] : []);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [activeId, setActiveId] = useState<string>(image?.id || "");

  const [editInstruction, setEditInstruction] = useState("");
  const [showEditInput, setShowEditInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingVariation, setIsCreatingVariation] = useState(false);

  const [compareMode, setCompareMode] = useState(false);
  const [compareId, setCompareId] = useState<string | null>(null);

  const [versionToDelete, setVersionToDelete] = useState<PreparedImageItem | null>(null);
  const [isDeletingVersion, setIsDeletingVersion] = useState(false);

  useEffect(() => {
    if (!image) return;
    setVersions([image]);
    setActiveId(image.id);
    setShowEditInput(false);
    setEditInstruction("");
    setCompareMode(false);
    setCompareId(null);

    let cancelled = false;
    setLoadingVersions(true);
    imageGenService
      .getVersions(image.rootImageId)
      .then((res: any) => {
        if (cancelled) return;
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const fetched: PreparedImageItem[] = res.data.map(toPreparedImage);
          // This fetch can resolve AFTER a real edit/variation call (20-100s) has already
          // appended a new version locally — an unconditional overwrite here would silently
          // drop that version from `versions`, leaving `activeId` pointing at something no
          // longer in the list (falling back to the original image) and making follow-up
          // edits/variations target the wrong source. Merge instead: prefer the server's
          // copy of anything it knows about, but keep any local-only version it doesn't yet.
          setVersions((prev) => {
            const fetchedIds = new Set(fetched.map((v) => v.id));
            const localOnly = prev.filter((v) => !fetchedIds.has(v.id));
            return [...fetched, ...localOnly].sort((a, b) => a.versionNumber - b.versionNumber);
          });
        }
      })
      .catch(() => {
        // Fall back to just showing the single image — version history is a nice-to-have
      })
      .finally(() => !cancelled && setLoadingVersions(false));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image?.id]);

  if (!image) return null;

  const active = versions.find((v) => v.id === activeId) || image;
  const compareImage = compareId ? versions.find((v) => v.id === compareId) || null : null;

  const copyPrompt = () => {
    navigator.clipboard.writeText(active.prompt);
    toast.success("Prompt copied to clipboard");
  };

  const handleApplyEdit = async () => {
    if (!editInstruction.trim() || isEditing) return;
    setIsEditing(true);
    try {
      const res: any = await imageGenService.editImage(active.id, editInstruction.trim());
      if (res.success && res.data) {
        const newVersion = toPreparedImage(res.data);
        setVersions((prev) => [...prev, newVersion]);
        setActiveId(newVersion.id);
        setEditInstruction("");
        setShowEditInput(false);
        toast.success("Edit applied");
        onLineageChanged();
      } else {
        toast.error(res.error || res.message || "Failed to apply edit");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to apply edit");
    } finally {
      setIsEditing(false);
    }
  };

  const handleCreateVariation = async () => {
    if (isCreatingVariation) return;
    setIsCreatingVariation(true);
    try {
      const res: any = await imageGenService.createVariation(active.id);
      if (res.success && res.data) {
        const newVersion = toPreparedImage(res.data);
        setVersions((prev) => [...prev, newVersion]);
        setActiveId(newVersion.id);
        toast.success("Variation created");
        onLineageChanged();
      } else {
        toast.error(res.error || res.message || "Failed to create variation");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to create variation");
    } finally {
      setIsCreatingVariation(false);
    }
  };

  const handleVersionClick = (versionId: string) => {
    if (compareMode) {
      setCompareId(versionId === activeId ? null : versionId);
    } else {
      setActiveId(versionId);
    }
  };

  // Deletes a single NON-root version from this lineage. The root stays deletable only via the
  // existing whole-lineage "delete" action below (onDelete), never from this per-thumbnail
  // control, so a small hover icon here can never accidentally wipe out the entire history.
  const handleConfirmDeleteVersion = async () => {
    if (!versionToDelete) return;
    const deletedId = versionToDelete.id;
    setIsDeletingVersion(true);
    try {
      await imageGenService.deleteImage(deletedId);
      const remaining = versions.filter((v) => v.id !== deletedId);
      setVersions(remaining);
      if (activeId === deletedId) {
        // Fall back to the root, or the most recent remaining version, instead of leaving
        // the viewer pointed at a version that no longer exists.
        const root = remaining.find((v) => !v.parentImageId);
        const fallback = root || remaining[remaining.length - 1] || null;
        setActiveId(fallback ? fallback.id : "");
      }
      if (compareId === deletedId) {
        setCompareId(null);
      }
      toast.success("Version deleted");
      onLineageChanged();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to delete version");
    } finally {
      setIsDeletingVersion(false);
      setVersionToDelete(null);
    }
  };

  return (
    <>
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl h-[90vh] md:h-auto md:max-h-[92vh] bg-[#151515] border border-[#242424] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white/80 hover:text-white rounded-full transition-colors backdrop-blur-md"
          title="Close"
          aria-label="Close image details"
        >
          <FiX size={20} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-2/3 h-[45%] md:h-auto bg-black/50 flex flex-col shrink-0">
          <div className="flex-1 flex items-center justify-center p-4 md:p-6 checkered-bg overflow-hidden">
            {compareMode && compareImage ? (
              <div className="grid grid-cols-2 gap-2 w-full h-full">
                {[active, compareImage].map((v) => (
                  <div key={v.id} className="flex flex-col min-h-0">
                    <VersionImage src={v.src} alt={v.alt} className="w-full h-full object-contain rounded-lg shadow-lg" />
                    <div className="text-center text-[10px] text-gray-400 mt-1 uppercase tracking-wider">
                      V{v.versionNumber} · {VERSION_TYPE_LABEL[v.versionType]}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <VersionImage src={active.src} alt={active.alt} className="w-full h-full object-contain rounded-lg shadow-lg" />
            )}
          </div>

          {/* Version history strip */}
          {(versions.length > 1 || loadingVersions) && (
            <div className="border-t border-[#242424] p-3 shrink-0">
              <div className="flex items-center gap-2 mb-2 px-1">
                <FiLayers className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Version History {compareMode && "— pick a version to compare"}
                </span>
                {loadingVersions && <FiLoader className="w-3 h-3 text-gray-600 animate-spin" />}
              </div>
              <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
                {versions.map((v) => {
                  // The root of the lineage (no parentImageId) is only ever deletable via the
                  // whole-lineage action on the main card/modal — never from this strip.
                  const isRootVersion = !v.parentImageId;
                  return (
                    <div key={v.id} className="relative shrink-0 group/version">
                      <button
                        onClick={() => handleVersionClick(v.id)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          v.id === activeId
                            ? "border-[#DC2626]"
                            : v.id === compareId
                            ? "border-blue-500"
                            : "border-transparent hover:border-gray-600"
                        }`}
                        title={`V${v.versionNumber} · ${VERSION_TYPE_LABEL[v.versionType]}${v.editInstruction ? `: ${v.editInstruction}` : ""}`}
                      >
                        <img src={v.src} alt={v.alt} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[8px] font-bold text-center py-0.5">
                          V{v.versionNumber}
                        </span>
                      </button>
                      {!isRootVersion && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setVersionToDelete(v);
                          }}
                          className="absolute top-0.5 right-0.5 p-1 bg-black/70 hover:bg-[#DC2626] text-white rounded-md opacity-0 group-hover/version:opacity-100 focus:opacity-100 transition-opacity"
                          title={`Delete V${v.versionNumber}`}
                          aria-label={`Delete version ${v.versionNumber}`}
                        >
                          <FiTrash2 size={10} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/3 h-[55%] md:h-auto p-5 md:p-6 flex flex-col bg-[#151515] border-t md:border-t-0 md:border-l border-[#242424] overflow-hidden">
          <div className="mb-3 shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg md:text-xl font-bold text-white font-plus-jakarta">
                Image Details
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#242424] text-gray-300 px-2 py-0.5 rounded-full">
                {VERSION_TYPE_LABEL[active.versionType]} · V{active.versionNumber}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-plus-jakarta">{image.createdAt}</p>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 pr-2 custom-scrollbar min-h-0 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-semibold text-gray-300 font-plus-jakarta">
                  {active.editInstruction ? "Edit Instruction" : "Prompt"}
                </h4>
                <button
                  onClick={copyPrompt}
                  className="flex items-center gap-1.5 text-xs text-[#DC2626] hover:text-red-400 transition-colors font-medium px-2 py-1 rounded-md hover:bg-[#DC2626]/10"
                >
                  <FiCopy size={12} /> Copy
                </button>
              </div>
              <div className="p-3 bg-[#0D0D0D] rounded-xl border border-[#242424] hover:border-[#333] transition-colors group">
                <p className="text-sm text-gray-300 leading-relaxed font-plus-jakarta selection:bg-red-900/30 selection:text-red-200 break-words">
                  {active.editInstruction || active.prompt}
                </p>
              </div>
            </div>

            {/* Continue editing */}
            <div>
              {!showEditInput ? (
                <button
                  onClick={() => setShowEditInput(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#242424] hover:bg-[#2a2a2a] text-white rounded-xl transition-all font-medium text-sm border border-transparent hover:border-[#333]"
                >
                  <FiEdit3 size={16} /> Continue Editing
                </button>
              ) : (
                <div className="space-y-2">
                  <textarea
                    value={editInstruction}
                    onChange={(e) => setEditInstruction(e.target.value.slice(0, 500))}
                    placeholder="Describe the change — e.g. 'change the background to a sunset' or 'make the logo bigger'"
                    rows={3}
                    disabled={isEditing}
                    className="w-full bg-[#0D0D0D] border border-[#242424] rounded-xl p-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-gray-500 disabled:opacity-50"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleApplyEdit}
                      disabled={!editInstruction.trim() || isEditing}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-[#DC2626] hover:bg-[#b91c1c] disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      {isEditing ? <FiLoader className="w-3.5 h-3.5 animate-spin" /> : <FiEdit3 size={14} />}
                      {isEditing ? "Applying..." : "Apply Edit"}
                    </button>
                    <button
                      onClick={() => {
                        setShowEditInput(false);
                        setEditInstruction("");
                      }}
                      disabled={isEditing}
                      className="px-3 py-2 bg-[#242424] hover:bg-[#2a2a2a] text-gray-300 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCreateVariation}
                disabled={isCreatingVariation}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#242424] hover:bg-[#2a2a2a] disabled:opacity-50 text-white rounded-xl transition-all font-medium text-xs border border-transparent hover:border-[#333]"
              >
                {isCreatingVariation ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiShuffle size={15} />}
                {isCreatingVariation ? "Creating..." : "Create Variation"}
              </button>
              <button
                onClick={() => {
                  setCompareMode((v) => !v);
                  if (compareMode) setCompareId(null);
                  else if (versions.length === 2) {
                    setCompareId(versions.find((v) => v.id !== activeId)?.id || null);
                  }
                }}
                disabled={versions.length < 2}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all font-medium text-xs border ${
                  compareMode
                    ? "bg-blue-500/20 border-blue-500/50 text-blue-300"
                    : "bg-[#242424] border-transparent hover:border-[#333] text-white"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
                title={versions.length < 2 ? "Create an edit or variation first to compare versions" : undefined}
              >
                <FiColumns size={15} />
                {compareMode ? "Comparing" : "Compare Versions"}
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-auto pt-4 border-t border-[#242424] shrink-0">
            <button
              onClick={() => onDownload(active.id, `generated-image-${active.id}.png`)}
              disabled={isDownloading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#242424] hover:bg-[#2a2a2a] text-white rounded-xl transition-all font-medium text-sm border border-transparent hover:border-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <FiLoader size={16} className="animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <FiDownload size={16} /> Download
                </>
              )}
            </button>
            <button
              onClick={() => onDelete(image.id)}
              className="flex items-center justify-center p-2.5 border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white rounded-xl transition-all"
              title="Delete this artwork and all its versions"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Rendered as a sibling of (not nested inside) the overlay above — that overlay closes the
        whole detail modal on backdrop click, and this confirmation needs its own backdrop click
        to only dismiss itself without also bubbling up and closing everything. */}
    <AlertModal
      isOpen={!!versionToDelete}
      onClose={() => setVersionToDelete(null)}
      onConfirm={handleConfirmDeleteVersion}
      title="Delete Version"
      message={
        versionToDelete
          ? `Are you sure you want to delete V${versionToDelete.versionNumber} (${VERSION_TYPE_LABEL[versionToDelete.versionType]})? This action cannot be undone and only this version will be removed — the rest of the version history stays intact.`
          : ""
      }
      type="danger"
      action="delete"
      confirmText="Delete Version"
      cancelText="Keep it"
      isLoading={isDeletingVersion}
      loadingText="Deleting..."
    />
    </>
  );
};

const RecentImages: React.FC<RecentImagesProps> = ({ shouldRefresh }) => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<PreparedImageItem | null>(
    null
  );

  const [pageSize, setPageSize] = useState(window.innerWidth >= 1024 ? 10 : 8);

  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth >= 1024 ? 10 : 8);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [paginationInfo, setPaginationInfo] = useState<{
    currentPage: number;
    totalPages: number;
    totalCount: number;
  }>({ currentPage: 1, totalPages: 1, totalCount: 0 });

  // `silent` skips the `loading` flag — used when refreshing the gallery in the background
  // (e.g. after an edit/variation, to update a version-count badge) while the detail modal is
  // open. Toggling `loading` there would hit the `if (loading) return <Spinner/>` gate below
  // and unmount the whole tree, including the open modal — which reset its version-lineage
  // state on every remount and was the real cause of a "stuck on the pre-edit version" bug.
  const fetchImages = useCallback(async (pageNum: number, opts: { silent?: boolean } = {}) => {
    try {
      if (!opts.silent) setLoading(true);
      const data: any = await imageGenService.getHistory(pageNum, pageSize);

      const responseData = data.data || [];
      const paginationData = data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalCount: responseData.length
      };

      setImages(responseData);
      setPaginationInfo({
        currentPage: paginationData.currentPage,
        totalPages: paginationData.totalPages,
        totalCount: paginationData.totalCount
      });

    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      if (!opts.silent) setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchImages(page);
  }, [fetchImages, page, shouldRefresh]);


  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [downloadingImages, setDownloadingImages] = useState<Set<string>>(new Set());

  const handleDeleteClick = (imageId: string) => {
    setImageToDelete(imageId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!imageToDelete) return;

    try {
      setIsDeleting(true);
      await imageGenService.deleteImage(imageToDelete);
      toast.success("Image deleted");
      if (selectedImage && selectedImage.id === imageToDelete) {
        setSelectedImage(null);
      }
      fetchImages(page); // Refresh list
    } catch (error) {
      console.error("Failed to delete image:", error);
      toast.error("Failed to delete image");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setImageToDelete(null);
    }
  };

  const handleDownload = async (imageId: string, filename: string) => {
    // Prevent multiple simultaneous downloads of the same image
    if (downloadingImages.has(imageId)) {
      return;
    }

    try {
      // Mark as downloading
      setDownloadingImages(prev => new Set(prev).add(imageId));

      // Use backend proxy to bypass CORS
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      const downloadUrl = `${apiBase}/imaginative/download/${imageId}`;

      const token = localStorage.getItem('token');
      const response = await fetch(downloadUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Download complete");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download image");
    } finally {
      // Remove from downloading set
      setDownloadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageId);
        return newSet;
      });
    }
  };

  const preparedImages: PreparedImageItem[] = useMemo(() => {
    return images.map(toPreparedImage);
  }, [images]);

  // Use pagination info from server
  const total = paginationInfo.totalCount;
  const totalPages = paginationInfo.totalPages;

  // Directly use preparedImages as they are already the page items
  const pageItems = preparedImages;

  const ImageCard = ({ image }: { image: PreparedImageItem }) => (
    <article
      className="group relative overflow-hidden rounded-2xl bg-[#121212] border border-[#242424] hover:border-gray-700 cursor-pointer"
      onClick={() => setSelectedImage(image)}
    >
        <div className="relative h-full w-full rounded-2xl bg-[#121212] overflow-hidden">
            <div className="relative w-full aspect-square overflow-hidden">
                <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover"
                loading="lazy"
                />

                {/* Overlay only on hover for text legibility */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                {!!image.versionCount && (
                  <span className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-1 rounded-full border border-white/10">
                    <FiLayers className="w-3 h-3" /> {image.versionCount + 1}
                  </span>
                )}

                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                    onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(image.id, `generated-image-${image.id}.png`);
                    }}
                    disabled={downloadingImages.has(image.id)}
                    className="p-2 bg-black/60 hover:bg-[#333] text-white rounded-xl backdrop-blur-md border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={downloadingImages.has(image.id) ? "Downloading..." : "Download"}
                >
                    {downloadingImages.has(image.id) ? (
                      <FiLoader className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FiDownload className="w-3.5 h-3.5" />
                    )}
                </button>

                <button
                    onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(image.id);
                    }}
                    className="p-2 bg-black/60 hover:bg-red-500/20 text-white hover:text-red-400 rounded-xl backdrop-blur-md border border-white/10 hover:border-red-500/30"
                    title="Delete"
                >
                    <FiTrash2 className="w-3.5 h-3.5" />
                </button>
                </div>

                {/* Prompt Preview on Hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="text-xs text-gray-200 line-clamp-2 font-medium drop-shadow-md">
                        {image.prompt}
                    </p>
                </div>
            </div>
      </div>
    </article>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  if (!loading && images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-[#242424] rounded-2xl bg-[#121212] border-dashed">
        <div className="p-4 bg-[#1E1E1E] rounded-full mb-4">
            <FiImage className="w-8 h-8 text-gray-600" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">No images yet</h3>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">
            Your creative journey starts here. Use the generator above to create your first masterpiece!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-end justify-between mb-6 border-b border-[#242424] pb-4">
        <div>
            <h2 className="text-xl font-bold text-white mb-1 font-plus-jakarta tracking-tight">
             Library
            </h2>
            <p className="text-sm text-gray-400 font-medium">
            {total} {total === 1 ? 'masterpiece' : 'masterpieces'} created
            </p>
        </div>

        {/* Simple Pagination Indicator */}
        {total > 0 && (
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Page {page} of {totalPages}
            </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {pageItems.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>

      {total > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center mt-10">
          <div className="flex items-center gap-2 bg-[#121212] border border-[#242424] p-1.5 rounded-xl shadow-xl">
              <button
                aria-label="Previous page"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#242424] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>

              <div className="px-4 text-sm font-bold text-white">
                  {page} <span className="text-gray-600 font-normal mx-1">/</span> {totalPages}
              </div>

              <button
                aria-label="Next page"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#242424] disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedImage && (
        <ImageDetailModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDelete={handleDeleteClick}
          onDownload={handleDownload}
          isDownloading={downloadingImages.has(selectedImage.id)}
          onLineageChanged={() => fetchImages(page, { silent: true })}
        />
      )}

      {/* Alert Modal for Deletion UI is handled by parent/state */}
      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Artwork"
        message="Are you sure you want to delete this artwork? This action cannot be undone and the image will be lost forever."
        type="danger"
        action="delete"
        confirmText="Delete Forever"
        cancelText="Keep it"
        isLoading={isDeleting}
        loadingText="Deleting..."
      />
    </div>
  );
};

export default RecentImages;
