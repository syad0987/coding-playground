//  “client‑side brain” that talks to your Socket.IO server and keeps everything in sync.
import { useEffect, useState, useCallback, useMemo } from "react";

import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
export const useCodeSync = () => {
  const [roomId, setRoomId] = useState(() => {
    const hash = window.location.hash.replace("#", "");
    return hash || uuidv4().slice(0, 8);
  });

  const [username, setUsername] = useState(
    `User-${Math.floor(Math.random() * 1000)}`,
  );
  const [isConnected, setIsConnected] = useState(false);

  const [users, setUsers] = useState([]);
  const [code, setCode] = useState({
    html: '<h1 style="color: blue;">Code Playground 🚀</h1>',
    css: "body { margin: 0; padding: 20px; font-family: Arial; background: linear-gradient(45deg, #667eea, #764ba2); min-height: 100vh; }",
    js: 'console.log("Connected to room! 👋");',
  });
  // it's walkie‑talkie that lets the client talk to the server.
  const socket = useMemo(() => io("http://localhost:3001"), []);
  //Generate room on mount

  const createNewRoom = () => {
    const newRoom = uuidv4().slice(0, 8);
    window.location.hash = newRoom;
    setRoomId(newRoom);
  };

  //join room logic, Connection sequence
  useEffect(() => {
    if (!roomId) return;
    console.log("🚪 Joining room:", roomId);

    // Join room immediately

    const handleConnection = () => {
      console.log("connected:", socket.id);
      setIsConnected(true);

      // Join AFTER connection established
      socket.emit("join-room", { roomId, username });
    };

    const handleUserJoined = ({ users: userList }) => {
      console.log("users updated:", userList.length, "users");
      setUsers(userList); //backend give fullList
    };
    const handleCodeUpdated = (newCode) => {
      console.log("code-change");
      setCode(newCode);
    };
    const handleUserLeft = ({ users: userList }) => {
      console.log("user left:", userList.length, "users");
      setUsers(userList);
    };

    const handleDisconnect = () => {
      console.log("Disconnected");
      setIsConnected(false);
    };

    // Listener for connection events
    socket.on("connect", handleConnection);
    socket.on("user-joined", handleUserJoined);
    socket.on("code-change", handleCodeUpdated);
    socket.on("user-left", handleUserLeft);
    socket.on("disconnect", handleDisconnect);

    //cleanup
    return () => {
      socket.off("connect", handleConnection);
      socket.off("user-joined", handleUserJoined);
      socket.off("code-change", handleCodeUpdated);

      socket.off("user-left", handleUserLeft);
      socket.off("disconnect", handleDisconnect);
    };
  }, [roomId, username, socket]);

  const updateCode = useCallback(
    (activeTab, newCode) => {
      console.log(`✏️ Tab ${activeTab} → ${newCode?.substring(0, 30)}`);

      const updatedCode = { ...code, [activeTab]: newCode || "" };
      setCode(updatedCode);
      const payload = { roomId, code: updatedCode };
      console.log("📤 EMITTING:", payload);
      socket.emit("code-change", payload);
    },
    [roomId, code, socket],
  );

  return {
    roomId,
    username,
    setUsername,
    isConnected,
    users,
    code,
    updateCode,
    createNewRoom,
    socketId: socket.id,
  };
};
