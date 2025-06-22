// lib/socket.js
import { io } from "socket.io-client";

let socket;

export const initSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3001"); // Update if your backend URL differs
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initSocket() first.");
  }
  return socket;
};


// Reactions
export const sendReaction = ({ roomId, emoji, id }) => {
  const socket = getSocket();
  socket.emit("send-reaction", { roomId, emoji, id });
};

export const onReceiveReaction = (callback) => {
  const socket = getSocket();
  socket.on("receive-reaction", callback);
};

// Chat
export const sendChatMessage = ({ roomId, message }) => {
  const socket = getSocket();
  socket.emit("send-chat", { roomId, message });
};

export const onReceiveChat = (callback) => {
  const socket = getSocket();
  socket.on("receive-chat", callback);
};
