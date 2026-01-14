import { useEffect, useState, useCallback } from "react";
import { Editor } from "@monaco-editor/react";

import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const socket = io("http://localhost:3001");

function App() {
  const [roomId, setRoomId] = useState("");

  const [username, setUsername] = useState(
    `User-${Math.floor(Math.random() * 1000)}`
  );
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState("html");
  const [users, setUsers] = useState([]);

  const [status, setStatus] = useState("connecting...");
  const [code, setCode] = useState({
    html: '<div class="container"><h1>Hello Code Playground!</h1></div>',
    css: "body{...}",
    js: 'console.log("join a room and start collaborating ")',
  });

  useEffect(() => {
    const newRoomId = uuidv4().slice(0, 8);
    setRoomId(newRoomId);
  }, []);

  useEffect(() => {
    if (roomId) {
      socket.emit("join-room", { roomId, username });
      setIsConnected(true);

      socket.on("code-updated", (newCode) => setCode(newCode));
      socket.on("user-joined", ({ users: userList }) => setUsers(userList));
      socket.on("user-left", ({ username: leftUser }) => {
        setUsers((prev) => prev.filter((u) => u.username !== leftUser));
      });
    }
  }, [roomId, username]);

  const handleCodeChange = useCallback(
    (newCode) => {
      const updatedCode = { ...code, [activeTab]: newCode };

      setCode(updatedCode);

      socket.emit("code-change", { roomId, code: updatedCode });
    },
    [roomId, code, activeTab]
  );
  const copyRoomLink = () => {
    navigator.clipboard.writeText(`${window.location.href}#${roomId}`);
    alert("Room link copied! Share with friends ");
  };

  const generatePreviewHtml = () => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>${code.css}</style>
    </head>
    <body>
      ${code.html}
      <script>${code.js}</script>
    </body>
    </html>
    `;
  };
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center p-8">
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center max-w-md w-full">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
            CodePlayground
          </h1>
          <p className="text-gray-300 mb-6">Generating room...</p>
          <div className="space-y-4">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-400"
              placeholder="Your name (optional)"
            />
          </div>
        </div>
      </div>
    );
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
          <div>
            <input
              value={roomId}
              readonly
              className="bg-gray-800 px-4 py-2 rounded-xl border border-gray-600 w-64 font-mono"
            />
            <button
              onClick={copyRoomLink}
              className="bg-gradient-to-r from-green-500 to-blue-600 px-6 py-2 rounded-xl font-semibold hover: shadow-lg transition-all"
            >
              📋 Copy Link
            </button>
            <button
              onClick={() => {
                const newRoom = uuidv4().slice(0, 8);
                setRoomId(newRoom);
              }}
              className="bg-purple-600 px-6 py-2 rounded-xl font-semibold"
            >
              🔄 New Room{" "}
            </button>
          </div>
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
              <div className="bg-gray-900/50 border border-gray-600 rounded-xl mb-6 overflow-hidden flex">
                {["html", "css", "js"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-medium transition-all flex-1 ${
                      activeTab === tab
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg "
                        : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>
              {/*monaca editor */}
              <Editor
                height="500px"
                language={activeTab}
                theme="vs-dark"
                value={code[activeTab]}
                onChange={handleCodeChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>

          {/*users panel*/}
          <div className="space-y-6">
            <div className="bg-gray-800 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 sticky top-6">
              <h3 className="text-xl  font-semibold mb-4 text-gray-100 flex items-center gap-2 ">
                Users({users.length})
              </h3>
              <div className="space-y-2 max-h-96  overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex item-center gap-3 p-3 bg-gray-900 rounded-xl"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-semibold text-sm ">
                      {user.username.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-200 ">
                      {user.username}
                    </span>
                    {user.id === socket.id && (
                      <span className="text-xs bg-gray-500 px-2 py-1 rounded-full ">
                        You
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/*preview*/}
            <div className="bg-gray-800/80 backdrop-blur-sm border-gray-700 rounded-2xl p-6 sticky top-8 ">
              <h3
                className="text-2xl font-semibold
             mb-6 text-gray-100 "
              >
                Live Preview
              </h3>
              <iframe
                srcDoc={generatePreviewHtml()}
                className="w-full h-96 bg-white border border-gray-300 rounded-2xl shadow-2xl"
                sandbox="allow-scripts allow-same-origin"
              />
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
