// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Allow CORS (important for Next.js frontend)
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*", // Change this to your frontend domain in production
    methods: ["GET", "POST"],
  },
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Join room
  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);
    console.log(`🔗 ${socket.id} joined room: ${roomId}`);
    socket.to(roomId).emit("user-joined", { id: socket.id });
  });

  // Canvas Title sync
  socket.on("update-title", ({ roomId, title }) => {
    socket.to(roomId).emit("title-updated", { roomId, title });
  });

  // Canvas Background sync
  socket.on("update-background", ({ roomId, color }) => {
    socket.to(roomId).emit("background-updated", { roomId, color });
  });

  // Emoji Reactions
  socket.on("send-reaction", (reactionData) => {
    const { roomId } = reactionData;
    socket.to(roomId).emit("receive-reaction", reactionData);
  });

  // Chat Messages
  socket.on("send-chat", (messageData) => {
    const { roomId } = messageData;
    socket.to(roomId).emit("receive-chat", messageData);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on http://localhost:${PORT}`);
});
