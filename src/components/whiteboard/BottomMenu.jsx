"use client";

import React from "react";
import { Undo2, Redo2 } from "lucide-react";
import { useCanvasStore } from "../../store/canvasStore";

const BottomMenu = ({ canvasRef }) => {
  const {
    zoom,
    setZoom,
    translateX,
    translateY,
    setTranslate,
    undo,
    redo,
  } = useCanvasStore();

  // 👇 Fix: Define applyTransform to apply zoom and pan to canvas
  const applyTransform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Clear and apply background
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Apply new zoom and translate
    ctx.setTransform(zoom, 0, 0, zoom, translateX, translateY);

    // Optional: Re-draw canvas content if needed
  };

  const zoomIn = () => {
    const newZoom = Math.min(zoom + 0.1, 2);
    setZoom(newZoom);
    requestAnimationFrame(applyTransform);
  };

  const zoomOut = () => {
    const newZoom = Math.max(zoom - 0.1, 0.1);
    setZoom(newZoom);
    requestAnimationFrame(applyTransform);
  };

  const resetZoom = () => {
    setZoom(1);
    setTranslate(0, 0);
    requestAnimationFrame(applyTransform);
  };

  return (
    <div>
      {/* Zoom Controls */}
      <div className="fixed bottom-2 left-2 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-md z-50 inline-flex items-center gap-2">
        <button
          onClick={zoomOut}
          className="px-2 py-1 text-black dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          title="Zoom Out"
        >
          −
        </button>

        <span
          onClick={resetZoom}
          className="text-xs text-gray-800 dark:text-gray-200 font-medium w-6 text-center cursor-pointer"
          title="Reset Zoom"
        >
          {(zoom * 100).toFixed(0)}%
        </span>

        <button
          onClick={zoomIn}
          className="px-2 py-1 text-black dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          title="Zoom In"
        >
          +
        </button>
      </div>

      {/* Undo/Redo Controls */}
      <div className="fixed bottom-2 left-32 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-md z-50 p-1 inline-flex items-center gap-2">
        <button
          onClick={() => {
            undo();
            requestAnimationFrame(applyTransform);
          }}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 rounded-md"
          title="Undo"
        >
          <Undo2 size={14} />
        </button>

        <button
          onClick={() => {
            redo();
            requestAnimationFrame(applyTransform);
          }}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 rounded-md"
          title="Redo"
        >
          <Redo2 size={14} />
        </button>
      </div>

      {/* Help Button */}
      <div className="fixed bottom-3 right-2 z-10">
        <button className="w-6 h-6 flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition">
          ?
        </button>
      </div>

      {/* Export Button */}
      <div className="fixed bottom-2 right-10 z-10">
        <button className="px-2 py-1 bg-primary dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm text-white hover:bg-purple-800 dark:hover:bg-purple-800 transition">
          Export
        </button>
      </div>
    </div>
  );
};

export default BottomMenu;
