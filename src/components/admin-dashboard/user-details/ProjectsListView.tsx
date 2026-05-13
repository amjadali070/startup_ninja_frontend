import React from "react";
import { Project } from "../../../types/admin";
import { FaProjectDiagram, FaCalendarAlt, FaTag } from "react-icons/fa";

interface ProjectsListViewProps {
  projects: Project[];
}

const ProjectsListView: React.FC<ProjectsListViewProps> = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12 bg-[#1A1A1A] rounded-2xl border border-[#242424] text-gray-400">
        No sales projects found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => {
        const projectStatus = project.status || project.pipelineStage || "new";
        return (
        <div
          key={project._id}
          className="bg-[#1A1A1A] p-4 rounded-xl border border-[#242424] hover:border-[#333] transition-all"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <FaProjectDiagram className="text-purple-500" />
              </div>
              <div>
                <h3 className="text-white font-medium">{project.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-1">{project.description || 'No description'}</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-purple-500/10 text-purple-500 rounded-md text-[10px] font-medium uppercase">
              {projectStatus}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#242424]">
            <div className="flex items-center gap-2 text-gray-400">
              <FaCalendarAlt className="text-xs" />
              <span className="text-[10px]">{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <FaTag className="text-xs" />
              <span className="text-[10px]">Project</span>
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
};

export default ProjectsListView;
