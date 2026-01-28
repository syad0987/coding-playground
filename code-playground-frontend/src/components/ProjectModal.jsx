import { useState } from "react";
const ProjectModal = ({ isOpen, onClose, projects, onSave, onLoad }) => {
  if (!isOpen) return null;

  const [projectTitle, setProjectTitle] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border rounded-2xl p-8 w-full max-w-md max-h[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold mb-4">My Projects</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {projects.length ? (
            Array.isArray(projects) &&
            projects.map((project) => (
              <div
                key={project._id}
                className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  onLoad(project._id);
                  onClose();
                }}
              >
                {projects
                  ?.filter((p) => p && p.title) // Safety filter
                  .map((project) => (
                    <div key={project._id} onClick={() => onLoad(project._id)}>
                      {project.title} {/* Fixed undefined.title */}
                    </div>
                  )) || <div>No projects</div>}

                {project.createdAt && (
                  <p className="text-sm text-gray-400">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              No projects yet
              <br />
              <small>Create your first one!</small>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <input
            placeholder="New project name..."
            type="text"
            value={projectTitle}
            className=" w-full p-3 bg-gray-800 border rounded-xl mb-4"
            onChange={(e) => setProjectTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && projectTitle.trim()) {
                onSave(projectTitle.trim());
                setProjectTitle(""); // reset only after save
                onClose();
              }
            }}
          />
        </div>

        <div className="flex gap-3">
          <button
            className="flex-1 bg-green-500 hover:bg-green-600 p-3 rounded-xl font-medium"
            disabled={!projectTitle.trim()} // disable if empty
            onClick={() => {
              if (projectTitle.trim()) {
                onSave(projectTitle.trim());
                setProjectTitle("");
                onClose();
              }
            }}
          >
            Save New
          </button>
          <button
            className="flex-1 bg-gray-600 hover:bg-gray-400 p-3 rounded-xl"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
