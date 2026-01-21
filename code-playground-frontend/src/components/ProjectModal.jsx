const ProjectModal = ({ isOpen, onClose, projects, onSave, onLoad }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border rounded-2xl p-8 w-full max-w-md max-h[80vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">My Projects</h2>
        <div className="space-y-3 mb-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 cursor-pointer"
              onClick={() => onLoad(project)}
            >
              <h4 className="font-semibold">{project.title}</h4>
              <p className="text-sm text-gray-400">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
        <input
          type="Project name"
          className=" w-full p-3 bg-gray-800 border rounded-xl mb-4"
          onKeyDown={(e) => {
            if (e.key === "Enter") onSave(e.target.value);
          }}
        />
        <div className="flex gap-3">
          <button
            className="flex-1 bg-green-500 hover:bg-green-600 p-3 rounded-xl font-medium"
            onClick={() => onSave(document.querySelector("input")?.value)}
          >
            Save
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
