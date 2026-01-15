import { useEffect, useState, useCallback, useMemo } from "react";

import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
export const useCodeSync = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState(
    `User-${Math.floor(Math.random() * 1000)}`
  );
  const [isConnected, setIsConnected] = useState(false);

  const [users, setUsers] = useState([]);
  const [code, setCode] = useState({
    html: '<div class="container"><h1>Hello Code Playground!</h1></div>',
    css: "body{...}",
    js: 'console.log("join a room and start collaborating ")',
  });
  const socket = useMemo(() => io("http://localhost:3001"), []);

  //Generate room on mount
  useEffect(() => {
    const newRoomId = uuidv4();
    setRoomId(newRoomId);
  }, []);

  //join room logic
  useEffect(() => {
    if (!roomId) return;

    socket.emit("join-room", { roomId, username });
    socket.on("connect", () => {
      console.log("Connected with id:", socket.id);

      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      console.log("Disconnected");
      setIsConnected(false);
    });
    socket.on("code-updated", (newCode) => setCode(newCode));
    socket.on("user-joined", ({ users: userList }) => setUsers(userList));
    socket.on("user-left", ({ username: leftUser }) => {
      setUsers((prev) => prev.filter((u) => u.username !== leftUser));
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");

      socket.off("code-updated");
      socket.off("user-joined");
      socket.off("user-left");

      socket.disconnect();
    };
  }, [roomId, username, socket]);

  const updateCode = useCallback(
    (activeTab, newCode) => {
      setCode((prev) => {
        const updatedCode = { ...prev, [activeTab]: newCode };
        socket.emit("code-change", { roomId, code: updatedCode });
        return updatedCode;
      });
    },
    [roomId]
  );
  return {
    roomId,
    username,
    setUsername,
    isConnected,
    users,
    code,
    updateCode,
    socket,
  };
};
