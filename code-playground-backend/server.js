const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "code playground backend" });
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("connected", socket.id);

  socket.on("join-room", ({ roomId, username }) => {
    socket.roomId = roomId;
    socket.username = username || `user-${socket.id.slice(-4)}`;
    socket.join(roomId);

    if (!rooms[roomId]) rooms[roomId] = [];
    rooms[roomId] = rooms[roomId].filter((u) => u.id !== socket.id);
    rooms[roomId].push({ id: socket.id, username: socket.username });

    console.log(
      `${socket.username} joined ${roomId} (${rooms[roomId].length})`,
    );
    io.to(roomId).emit("user-joined", { users: rooms[roomId], roomId });
  });

  socket.on("code-change", (data) => {
    if (data.roomId && data.code) {
      socket.to(data.roomId).emit("code-change", data.code);
    }
  });

  socket.on("disconnect", () => {
    if (socket.roomId && rooms[socket.roomId]) {
      rooms[socket.roomId] = rooms[socket.roomId].filter(
        (u) => u.id !== socket.id,
      );
      io.to(socket.roomId).emit("user-left", {
        users: rooms[socket.roomId],
        roomId: socket.roomId,
      });
      console.log(
        `${socket.username} left ${socket.roomId} (${rooms[socket.roomId].length} remains)`,
      );
    }
  });
});

// io.on("connection", (socket) => {
//   console.log("connected:", socket.id);
//   // ✅ BLOCK DUPLICATES (React StrictMode fix)
//   if (recentConnections.has(socket.id)) {
//     console.log("🚫 Duplicate connection blocked:", socket.id);
//     socket.disconnect();
//     return;
//   }
//   recentConnections.set(socket.id, Date.now());
//   setTimeout(() => recentConnections.delete(socket.id), 10000);

//   let reconnectTimer;

//   socket.on("join-room", ({ roomId, username }) => {
//     clearTimeout(reconnectTimer); //clear pending reconnect
//     socket.roomId = roomId;
//     socket.username = username || `User-${socket.id.slice(-4)}`;
//     socket.join(roomId);

//     //track users in room
//     //initalize room users
//     if (!rooms[roomId]) {
//       rooms[roomId] = [];
//     }
//     //add user to room

//     rooms[roomId] = rooms[roomId].filter((u) => u.id !== socket.id);

//     rooms[roomId].push({ id: socket.id, username: socket.username });
//     console.log(
//       `${socket.username} joined ${roomId} (${rooms[roomId].length})`,
//     );
//     //broadcast existing users list
//     io.to(roomId).emit("user-joined", {
//       users: rooms[roomId],
//       message: `${socket.username} joined! (${rooms[roomId].length}) `,
//     });
//   });

//   socket.on("code-change", (data) => {
//     if (data.roomId && socket.roomId === data.roomId) {
//       console.log(`Code change in ${data.roomId}`);
//       socket.to(data.roomId).emit("code-updated", data.code);
//     }
//   });
//   socket.on("disconnect", (reason) => {
//     if (socket.roomId && rooms[socket.roomId]) {
//       reconnectTimer = setTimeout(() => {
//         const roomUsers = rooms[socket.roomId] || [];
//         rooms[socket.roomId] = roomUsers.filter((u) => u.id !== socket.id);
//         if (rooms[socket.roomId].length === 0) {
//           delete rooms[socket.roomId];
//         }
//         io.to(socket.roomId).emit("user-left", {
//           users: rooms[socket.roomId] || [],
//           message: `${socket.username || "user"} left (${reason})`,
//         });

//         console.log(
//           ` ${socket.username || "user"} left ${socket.roomId} (${
//             rooms[socket.roomId]?.length || 0
//           } left)`,
//         );
//       }, 3000);
//     }
//   });
// });

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Backend running: http://localhost:${PORT}`);
  console.log(`test health: http://localhost:${PORT}/health`);
});
