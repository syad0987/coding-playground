import { useState } from "react";
import { useCodeSync } from "./hooks/useCodeSync";
import EditorTabs from "./components/EditorTabs";
import CodeEditor from "./components/CodeEditor";
import UserList from "./components/UserList";
import RoomControls from "./components/RoomControls";
import LivePreview from "./components/LivePreview";
import ConnectionScreen from "./components/ConnectionScreen";

function App() {
  const [activeTab, setActiveTab] = useState("html");
  const {
    roomId,
    username,
    setUsername,
    isConnected,
    users,
    code,
    updateCode,
    socket,
  } = useCodeSync();

  const handleNewRoom = () => {
    window.location.reload();
  };

  if (!isConnected) {
    return <ConnectionScreen username={username} setUsername={setUsername} />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/*header*/}
        <header className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
              CodePlayGround
            </h1>

            <div className=" flex items-center  gap-4  mt-2">
              <span>{users.length} online</span>
              <span className="text-sm text-gray-400">you:{username}</span>
            </div>
          </div>
          <RoomControls roomId={roomId} onNewRoom={handleNewRoom} />
        </header>

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
                onCodeChange={(newCode) => updateCode(activeTab, newCode)}
              />
            </div>
          </div>

          {/*users panel=sidebar*/}
          <div className="space-y-6">
            <div className="bg-gray-800 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sticky top-6">
              <UserList users={users} currentUserId={socket.id} />
            </div>

            {/*preview*/}
            <div className="bg-gray-800/80 backdrop-blur-sm border-gray-700 rounded-2xl p-6 sticky top-8 ">
              <h3
                className="text-2xl font-semibold
             mb-6 text-gray-100 "
              >
                Live Preview
              </h3>
              <LivePreview html={code.html} css={code.css} js={code.js} />
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
