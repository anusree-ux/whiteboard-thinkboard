// store/canvasStore.js
import { create } from "zustand";
import { getSocket } from "../lib/socket";

export const useCanvasStore = create((set, get) => ({
  // Titles
  titles: {},
  setTitle: (roomId, title) => {
    const updated = { ...get().titles, [roomId]: title };
    set({ titles: updated });
    const socket = getSocket();
    if (socket) socket.emit("update-title", { roomId, title });
  },
  updateTitleFromSocket: (roomId, title) => {
    const updated = { ...get().titles, [roomId]: title };
    set({ titles: updated });
  },

  // Backgrounds
  backgrounds: {},
  setBackground: (roomId, color) => {
    const updated = { ...get().backgrounds, [roomId]: color };
    set({ backgrounds: updated });
    const socket = getSocket();
    if (socket) socket.emit("update-background", { roomId, color });
  },
  updateBackgroundFromSocket: (roomId, color) => {
    const updated = { ...get().backgrounds, [roomId]: color };
    set({ backgrounds: updated });
  },

  // Zoom/Pan
  zoom: 1,
  translateX: 0,
  translateY: 0,
  setZoom: (zoom) => set({ zoom }),
  setTranslate: (x, y) => set({ translateX: x, translateY: y }),

  // History
  history: [],
  redoStack: [],
  addToHistory: (path) => {
    const { history } = get();
    set({ history: [...history, path], redoStack: [] });
  },
  undo: () => {
    const { history, redoStack } = get();
    if (history.length === 0) return;
    const last = history.pop();
    set({ history, redoStack: [...redoStack, last] });
  },
  redo: () => {
    const { history, redoStack } = get();
    if (redoStack.length === 0) return;
    const restored = redoStack.pop();
    set({ history: [...history, restored], redoStack });
  },
}));
