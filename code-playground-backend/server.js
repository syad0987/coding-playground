const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
//  Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const { title } = require("process");
//project schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  roomId: String,
  code: {
    html: String,
    css: String,
    js: String,
  },
  owner: String,
  ispublic: { type: Boolean, default: false },
  createAt: { type: Date, default: Date.now },
});

const Project = mongoose.model("Project", projectSchema);

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

//connect to mongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB Error:", err));
//Creates a new project in MongoDB(to save functionalities)
app.post("/projects", async (req, res) => {
  try {
    const projectData = {
      title: req.body.title || "untitled",
      roomId: req.body.roomi,
      code: req.body.code,
      owner: req.body.owner,
      ispublic: req.body.ispublic ?? false,
    };
    const project = new Project(projectData);

    await project.save();

    console.log("Received project:", project);

    res.json({ project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Fetches all projects for a given owner
app.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.query.owner });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Fetches a single project by its MongoDB _id
app.get("/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running: http://localhost:${PORT}`);
  console.log(`test health: http://localhost:${PORT}/health`);
});
