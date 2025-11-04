import { FC, useEffect, useState } from "react";
import WebBuilderService from "../../services/web-builder/WebBuilderService";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import DemoTemplates from "./config/DemoTemplates";

interface CreateWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateWebsiteModal: FC<CreateWebsiteModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [visible, setVisible] = useState(false);
  const { user } = useAuth();

  const [createLoading, setCreateLoading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleCreateWebsite = async () => {
    if (!projectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    setCreateLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", projectName);
      formData.append("description", projectDescription);
      formData.append("userId", user.id);

      const response = await WebBuilderService.createWebsiteProject(formData);

      if (response.success) {
        toast.success("Website project created successfully!");
        onClose();
        onCreated();
        const templateQuery =
          selectedTemplateId && selectedTemplateId !== "blank"
            ? `&template=${encodeURIComponent(selectedTemplateId)}`
            : "";
        window.open(
          `/ai-tools/web-builder/new-website?id=${response?.data?.projectId}${templateQuery}`,
          "_blank"
        );
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setCreateLoading(false);
      setProjectDescription("");
      setProjectName("");
      setSelectedTemplateId(null);
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (templateId === "blank") {
      setProjectName("Blank Website");
      setProjectDescription("Start from an empty template.");
      return;
    }
    const tpl: any = (DemoTemplates as any[]).find((t) => t.id === templateId);
    if (tpl) {
      setProjectName(tpl.name || "New Website");
      setProjectDescription(`Starter project using ${tpl.name} template.`);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        visible ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-50" : "opacity-0"
        }`}
      />
      <div
        className={`relative z-10 w-full max-w-4xl rounded-xl bg-[#1c1c1c] p-6 text-white shadow-xl transform transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">Create a Project</h2>
        <div className="mb-4">
          <label className="block text-sm mb-3">Project Name</label>
          <input
            type="text"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full rounded-md bg-[#131313] border h-12 border-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm mb-3">Project Description</label>
          <textarea
            placeholder="Provide a brief description of the project"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className="w-full rounded-md bg-[#131313] border border-gray-700 px-3 py-2 text-sm text-white h-24 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm">Start from Template</label>
            {selectedTemplateId && (
              <button
                type="button"
                onClick={() => setSelectedTemplateId(null)}
                className="text-xs text-gray-300 hover:text-white underline"
              >
                Clear selection
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto overflow-x-hidden rounded-md border border-gray-800 p-2 bg-[#131313] custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Blank template card */}
              <button
                type="button"
                onClick={() => handleSelectTemplate("blank")}
                className={`text-left rounded-lg border ${
                  selectedTemplateId === "blank"
                    ? "border-red-600 ring-1 ring-red-600/40"
                    : "border-gray-700"
                } bg-[#0f0f0f] overflow-hidden transition-colors hover:border-gray-600 focus:outline-none`}
              >
                <div className="relative w-full h-36 bg-black/80 flex items-center justify-center">
                  <div className="text-white/80 text-sm">Blank Template</div>
                  {selectedTemplateId === "blank" && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 text-[10px] rounded bg-red-600 text-white">
                      Selected
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-white text-sm font-semibold truncate">
                    Blank
                  </div>
                  <div className="text-gray-400 text-xs">Pages: 1</div>
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewTemplateId("blank");
                      }}
                      className="px-2 py-1 text-xs rounded-md border border-gray-700 text-gray-200 hover:bg-white/10"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </button>

              {DemoTemplates.map((tpl: any) => {
                const rawHtml = tpl?.data?.pages?.[0]?.component || "<div />";
                const previewHtml = `<!doctype html><html><head><meta charset=\"utf-8\"/><style>html,body{margin:0;padding:0;overflow:hidden;background:#0b0b0f}::-webkit-scrollbar{display:none}</style></head><body>${rawHtml}</body></html>`;
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className={`text-left rounded-lg border ${
                      isSelected
                        ? "border-red-600 ring-1 ring-red-600/40"
                        : "border-gray-700"
                    } bg-[#0f0f0f] overflow-hidden transition-colors hover:border-gray-600 focus:outline-none`}
                  >
                    <div className="relative w-full h-36 bg-black/60 overflow-hidden">
                      <iframe
                        title={`preview-${tpl.id}`}
                        className="w-full h-full border-none pointer-events-none"
                        srcDoc={previewHtml}
                        scrolling="no"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 text-[10px] rounded bg-red-600 text-white">
                          Selected
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="text-white text-sm font-semibold truncate">
                        {tpl.name}
                      </div>
                      <div className="text-gray-400 text-xs">
                        Pages: {tpl?.data?.pages?.length || 1}
                      </div>
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewTemplateId(tpl.id);
                          }}
                          className="px-2 py-1 text-xs rounded-md border border-gray-700 text-gray-200 hover:bg-white/10"
                        >
                          Preview
                        </button>
                      </div>
                    </div>
                  </button>
                );
              })}
              {!DemoTemplates?.length && (
                <div className="text-xs text-gray-400 p-2">
                  No templates available.
                </div>
              )}
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            Leave unselected to start with a blank project.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateWebsite}
            disabled={createLoading}
            className={`px-4 py-2 rounded-md font-semibold hover:shadow-lg transition-colors duration-200 ${
              createLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#ec2222] text-white hover:bg-red-600"
            }`}
          >
            {createLoading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </div>

      {previewTemplateId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            onClick={() => setPreviewTemplateId(null)}
            className="fixed inset-0 bg-black/70"
          />
          <div className="relative z-10 w-[95%] max-w-5xl rounded-xl bg-[#111111] border border-[#2a2a2a] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-[#2a2a2a]">
              <div className="text-white text-sm font-semibold">
                {previewTemplateId === "blank"
                  ? "Blank Template"
                  : (DemoTemplates as any[]).find(
                      (t) => t.id === previewTemplateId
                    )?.name || "Template Preview"}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!previewTemplateId) return;
                    handleSelectTemplate(previewTemplateId);
                    setPreviewTemplateId(null);
                  }}
                  className="px-3 py-1.5 text-xs rounded-md bg-red-600 text-white hover:bg-red-500"
                >
                  Use This Template
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTemplateId(null)}
                  className="px-3 py-1.5 text-xs rounded-md border border-gray-700 text-gray-200 hover:bg-white/5"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="w-full h-[70vh] bg-black">
              {previewTemplateId === "blank" ? (
                <div className="w-full h-full flex items-center justify-center text-white/80">
                  Blank Template
                </div>
              ) : (
                <iframe
                  title="template-full-preview"
                  className="w-full h-full border-none"
                  srcDoc={
                    (DemoTemplates as any[]).find(
                      (t) => t.id === previewTemplateId
                    )?.data?.pages?.[0]?.component || "<div />"
                  }
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CreateWebsiteModal;
