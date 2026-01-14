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
  console.log("user connected:", socket.id);

  socket.on("join-room", ({ roomId, username }) => {
    socket.roomId = roomId;
    socket.username = username || `user-${socket.id.slice(0, 4)}`;
    socket.join(roomId);

    //track users in room
    if (!rooms[roomId]) rooms[roomId] = [];
    rooms[roomId].push({ id: socket.id, username: socket.username });
    console.log(`${socket.username} joined room: ${roomId}`);

    //broadcast existing users list
    io.to(roomId).emit("user-joined", {
      username: socket.username,
      users: rooms[roomId],
    });
  });
  socket.on("code-change", (data) => {
    socket.to(data.roomId).emit("code-updated", data.code);
  });
  socket.on("disconnect", () => {
    if (socket.roomId && rooms[socket.roomId]) {
      rooms[socket.roomid] = rooms[socket.roomId].filter(
        (u) => u.id !== socket.id
      );
      io.to(socket.roomId).emit("user-left", { username: socket.username });
      console.log(`${socket.username} left`);
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Backend running: http://localhost:${PORT}`);
  console.log(`test health: http://localhost:${PORT}/health`);
});
