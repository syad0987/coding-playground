const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
//  Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");

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
const rooms = {};
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
  serverClient: true,
});

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "code playground backend" });
});

io.on("connection", (socket) => {
  console.log("connected", socket.id);

  socket.on("join-room", ({ roomId, username, firebaseUid }) => {
    socket.roomId = roomId;
    socket.username = username || `user-${socket.id.slice(-4)}`;
    socket.firebaseUid = firebaseUid;
    socket.join(roomId);

    // ✅ FIXED: Proper immutable updates
    if (!rooms[roomId])
      rooms[roomId] = { users: [], code: { html: "", css: "", js: "" } };
    rooms[roomId].users = [
      ...rooms[roomId].users.filter((u) => u.id !== socket.id),
      { id: socket.id, username: socket.username },
    ];
    socket.emit("initial-code", rooms[roomId].code);
    io.to(roomId).emit("user-joined", { users: rooms[roomId].users, roomId });
    console.log(
      `${socket.username} joined ${roomId} (${rooms[roomId].length})`,
    );
  });

  socket.on("code-change", (data) => {
    if (data.roomId && data.code) {
      rooms[data.roomId].code = data.code;
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
        `${socket.username} left ${socket.roomId} (${rooms[socket.roomId].length || 0} remains)`,
      );
    }
  });

  socket.on("get-room-code", async (roomId) => {
    if (rooms[roomId]) {
      socket.emit("initial-code", rooms[roomId].code);
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
  console.log("📥 POST /projects body:", req.body.title);
  try {
    console.log("📥 POST /projects body/ save:", req.body.title);
    const projectData = new Project({
      // _id: Date.now().toString(),/
      title: req.body.title || "untitled",
      roomId: req.body.roomId,
      code: req.body.code || { html: "", css: "", js: "" },
      owner: req.body.owner,
      ispublic: req.body.ispublic ?? false,
    });
    await projectData.save();
    console.log("💾 SAVED project ID:", projectData._id);

    res.json({ project: projectData });
  } catch (err) {
    console.error("MongoDB save error:", err);
    res.status(500).json({ error: err.message });
  }
});

//Fetches all projects for a given owner
app.get("/projects", async (req, res) => {
  console.log("🔍 DEBUG req.query:", req.query);
  console.log("🔍 req.query.owner:", req.query.owner);
  try {
    const owner = req.query.owner || "GUEST";
    console.log("FETCHING for owner:", owner);
    const projects = await Project.find({ owner });
    console.log("MongoDB LOAD:", projects.length, "for", owner);
    res.json(projects);
  } catch (err) {
    console.error("MongoDB LOAD error:", err);
    res.json([]);
  }
});
// Fetches a single project by its MongoDB _id
app.get("/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      // project = await Project.findOne({ title: idOrTitle });
      return res.status(404).json({ error: "Project not found" });
    }
    // project ? res.json(project) : res.status(404).json({ error: "not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/room/:roomId", async (req, res) => {
  try {
    const project = await Project.findOne({ roomId: req.params.roomId });
    if (project && !rooms[req.params.roomId]) {
      rooms[req.params.roomId] = {
        users: [],
        code: project.code,
      };
    }
    res.json(
      rooms[req.params.roomId] || { code: { html: "", css: "", js: "" } },
    );
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 Backend running: http://localhost:${PORT}`);
  console.log(`test health: http://localhost:${PORT}/health`);
});
