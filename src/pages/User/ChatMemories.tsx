import { useCallback, useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiArrowLeft, FiTrash2, FiEdit2, FiCheck, FiX, FiPlus } from "react-icons/fi";
import { PiBrainLight } from "react-icons/pi";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../hooks/useAuth.tsx";
import { memoryService } from "../../services/ai-chat/memory.ts";
import { Memory } from "../../types/ai-content";

const ChatMemories: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadMemories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await memoryService.listMemories();
      if (response.success && response.data) {
        setMemories(response.data);
      } else {
        toast.error(response.message || "Failed to load memories");
      }
    } catch (err) {
      console.error("Failed to load memories:", err);
      toast.error("Failed to load memories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMemories();
  }, [loadMemories]);

  const handleAdd = async () => {
    const trimmed = newContent.trim();
    if (!trimmed || isSaving) return;

    setIsSaving(true);
    try {
      const response = await memoryService.createMemory(trimmed);
      if (response.success && response.data) {
        setMemories((prev) => [response.data!, ...prev]);
        setNewContent("");
        setIsAdding(false);
        toast.success("Memory saved");
      } else {
        toast.error(response.message || "Failed to save memory");
      }
    } catch (err) {
      console.error("Failed to save memory:", err);
      toast.error("Failed to save memory");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartEdit = (memory: Memory) => {
    setEditingId(memory._id);
    setEditContent(memory.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleSaveEdit = async (memoryId: string) => {
    const trimmed = editContent.trim();
    if (!trimmed || isSaving) return;

    setIsSaving(true);
    try {
      const response = await memoryService.updateMemory(memoryId, trimmed);
      if (response.success && response.data) {
        setMemories((prev) =>
          prev.map((m) => (m._id === memoryId ? response.data! : m))
        );
        setEditingId(null);
        setEditContent("");
        toast.success("Memory updated");
      } else {
        toast.error(response.message || "Failed to update memory");
      }
    } catch (err) {
      console.error("Failed to update memory:", err);
      toast.error("Failed to update memory");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (memoryId: string) => {
    try {
      const response = await memoryService.deleteMemory(memoryId);
      if (response.success) {
        setMemories((prev) => prev.filter((m) => m._id !== memoryId));
        toast.success("Memory deleted");
      } else {
        toast.error(response.message || "Failed to delete memory");
      }
    } catch (err) {
      console.error("Failed to delete memory:", err);
      toast.error("Failed to delete memory");
    }
  };

  return (
    <DashboardLayout
      activePath="/ai-tools/chat"
      title="Ninja Assistant Memory"
      onLogout={logout}
      onSettings={() => navigate("/settings")}
    >
      <main className="flex-1 overflow-y-auto bg-[#0D0D0D]">
        <div className="p-6 lg:p-10 max-w-[900px] mx-auto text-white min-h-screen">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/ai-tools/chat")}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
              aria-label="Back to chat"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#DE0500]/10 border border-[#DE0500]/20 flex items-center justify-center">
                <PiBrainLight className="h-5 w-5 text-[#DE0500]" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Saved Memories</h1>
                <p className="text-sm text-white/40">
                  Facts Ninja Assistant remembers about you across conversations.
                </p>
              </div>
            </div>
          </div>

          {/* Add new memory */}
          <div className="mb-6 rounded-2xl border border-white/10 bg-[#151515] p-4">
            {isAdding ? (
              <div className="flex flex-col gap-3">
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="e.g. My company is called Acme Inc."
                  rows={2}
                  maxLength={500}
                  autoFocus
                  className="w-full resize-none rounded-lg bg-[#0A0A0A] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#DE0500]/50"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setNewContent("");
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white/60 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={!newContent.trim() || isSaving}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#DE0500] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#DE0500]/90"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#DE0500]/10 hover:bg-[#DE0500]/20 border border-[#DE0500]/30 text-[#DE0500] hover:text-white transition-colors text-sm font-medium"
              >
                <FiPlus className="h-4 w-4" />
                Add a memory
              </button>
            )}
          </div>

          {/* List */}
          {isLoading ? (
            <div className="text-center py-16 text-white/40 text-sm">Loading memories…</div>
          ) : memories.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-white/10 bg-[#151515]">
              <PiBrainLight className="h-8 w-8 text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/40">No memories saved yet</p>
              <p className="text-xs text-white/30 mt-1">
                Save facts manually here, or use "Remember this" on any chat response.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {memories.map((memory) => (
                <div
                  key={memory._id}
                  className="group rounded-xl border border-white/10 bg-[#151515] px-4 py-3 flex items-start justify-between gap-3"
                >
                  {editingId === memory._id ? (
                    <div className="flex-1 flex flex-col gap-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={2}
                        maxLength={500}
                        autoFocus
                        className="w-full resize-none rounded-lg bg-[#0A0A0A] border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#DE0500]/50"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={handleCancelEdit}
                          className="p-1.5 rounded-md text-white/40 hover:text-white/70 hover:bg-white/10"
                          aria-label="Cancel edit"
                        >
                          <FiX className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleSaveEdit(memory._id)}
                          disabled={!editContent.trim() || isSaving}
                          className="p-1.5 rounded-md text-green-400 hover:bg-green-500/10 disabled:opacity-50"
                          aria-label="Save edit"
                        >
                          <FiCheck className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/85 break-words">{memory.content}</p>
                        <p className="text-xs text-white/30 mt-1">
                          {memory.source === "chat" ? "Saved from chat" : "Manually added"}
                          {memory.createdAt &&
                            ` · ${new Date(memory.createdAt).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={() => handleStartEdit(memory)}
                          className="p-1.5 rounded-md text-white/40 hover:text-white/70 hover:bg-white/10"
                          aria-label="Edit memory"
                        >
                          <FiEdit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(memory._id)}
                          className="p-1.5 rounded-md text-white/40 hover:text-red-400 hover:bg-red-500/10"
                          aria-label="Delete memory"
                        >
                          <FiTrash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
};

export default ChatMemories;
