import { FC, useEffect, useState } from 'react';
import WebBuilderService from '../../services/web-builder/WebBuilderService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

interface CreateWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateWebsiteModal: FC<CreateWebsiteModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [visible, setVisible] = useState(false);
  const { user } = useAuth();
  
  const [createLoading, setCreateLoading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

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
        toast.success('Website project created successfully!');
        onClose();
        onCreated();
        window.open(`/ai-tools/web-builder/new-website?id=${response?.data?.projectId}`, '_blank')
      } else {
        toast.error(response.message);
      }
    } catch (error:any) {
      toast.error(error);
    } finally {
      setCreateLoading(false);
      setProjectDescription("");
      setProjectName("");
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${ visible ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div onClick={onClose} className={`fixed inset-0 bg-black transition-opacity duration-300 ${ isOpen ? "opacity-50" : "opacity-0"}`} />
      <div className={`relative z-10 w-full max-w-md rounded-xl bg-[#1c1c1c] p-6 text-white shadow-xl transform transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}`}>
        <h2 className="text-xl font-semibold mb-4">Create a Project</h2>
        <div className="mb-4">
          <label className="block text-sm mb-3">Project Name</label>
          <input type="text" placeholder="Enter project name" value={projectName} onChange={(e) => setProjectName(e.target.value)}
            className="w-full rounded-md bg-[#131313] border h-12 border-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"/>
        </div>
        <div className="mb-6">
          <label className="block text-sm mb-3">Project Description</label>
          <textarea placeholder="Provide a brief description of the project" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)}
            className="w-full rounded-md bg-[#131313] border border-gray-700 px-3 py-2 text-sm text-white h-24 resize-none focus:outline-none focus:ring-2 focus:ring-red-600"/>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600">
            Cancel
          </button>
          <button onClick={handleCreateWebsite} disabled={createLoading}
            className={`px-4 py-2 rounded-md font-semibold hover:shadow-lg transition-colors duration-200 ${ createLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#ec2222] text-white hover:bg-red-600"}`}>
            {createLoading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default CreateWebsiteModal;