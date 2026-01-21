import { useState } from "react";
import { useCodeSync } from "./hooks/useCodeSync";
import EditorTabs from "./components/EditorTabs";
import CodeEditor from "./components/CodeEditor";
import UserList from "./components/UserList";
import RoomControls from "./components/RoomControls";
import LivePreview from "./components/LivePreview";
import ConnectionScreen from "./components/ConnectionScreen";
import ProjectModal from "./components/ProjectModal";
function App() {
  const [activeTab, setActiveTab] = useState("html");
  const {
    roomId,
    username,
    setUsername,
    users,
    code,
    updateCode,
    createNewRoom,
    socketId,
  } = useCodeSync();
  const [showProjects, setShowProjects] = useState(false);
  const [projects, setProjects] = useState([]);

  const saveProjects = async (title) => {
    const project = {
      title,
      roomId,
      code,
      owner: username,
      isPublic: true,
    };
    const res = await fetch("http://localhost:3001/projects", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(project),
    });
    const saved = await res.json();
    setProjects([...projects, saved.project]);
    setShowProjects(false);
  };
  const loadProjects = async () => {
    const res = await fetch(`http://localhost:3001/projects?owner=${username}`);
    const userProjects = await res.json();
    setProjects(userProjects);
    setShowProjects(true);
  };
  const loadProject = async (projectId) => {
    const res = await fetch(`http://localhost:3001/projects/${projectId}`);
    const project = await res.json();
    setCode(project.code);
  };

  if (!roomId) {
    return <ConnectionScreen username={username} setUsername={setUsername} />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/*header*/}
        <header className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
              CodePlayGround
            </h1>

            <div className=" flex items-center  gap-4  mt-2">
              <p className="text-gray-400">
                Room: <code className="font-mono">{roomId}</code> |{" "}
                {users.length} online <br />
                <span className="text-sm text-gray-400">you:{username}</span>
              </p>
            </div>
          </div>
          <RoomControls roomId={roomId} onNewRoom={createNewRoom} />
          <button
            onClick={loadProjects}
            className="bg-blue-500 px-4 py-2 rounded-xl"
          >
            Projects
          </button>
        </header>
        {/*Add modal*/}
        <ProjectModal
          isOpen={showProjects}
          onClose={() => setShowProjects(false)}
          projects={projects}
          onSave={saveProjects}
          onLoad={loadProject}
        ></ProjectModal>
        {/*main layout*/}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
          {/*editor*/}
          <div className="xl:col-span-3 space-y-6">
            <div className=" bg-gray-800  backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h2 className=" text-2xl font-semibold mb-6 text-gray-200 ">
                Editor
              </h2>
              {/*tabs*/}
              <EditorTabs activeTab={activeTab} setActiveTab={setActiveTab} />

              {/*monaca editor */}
              <CodeEditor
                activeTab={activeTab}
                code={code}
                onCodeChange={updateCode}
              />
            </div>
          </div>

          {/*users panel=sidebar*/}
          <div className="space-y-6">
            <div className="bg-gray-800 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sticky top-6">
              <UserList users={users} socketId={socketId} />
            </div>

            {/*preview*/}
            <div className="bg-gray-800/80 backdrop-blur-sm border-gray-700 rounded-2xl p-6 sticky top-8 ">
              <h3
                className="text-2xl font-semibold
             mb-6 text-gray-100 "
              >
                Live Preview
              </h3>
              <LivePreview code={code} />
            </div>
          </div>
        </div>

        <div className="mt-12 p-6  bg-gray-800 rounded-2xl text-center text-sm text-gray-400 border border-gray-700">
          <p className="text-lg text-gray-300 mb-2">
            Monaco Editor + Tabs Complete!
          </p>
          <p className=" text-sm text-gray-500">
            Open another tab → Edit HTML/CSS/JS → Watch live sync + preview
            magic ✨
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
