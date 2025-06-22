'use client';

import React, { useEffect, useRef } from 'react';
import LeftMenu from './whiteboard/LeftMenu';
import RightMenu from './whiteboard/RightMenu';
import BottomMenu from './whiteboard/BottomMenu';
import ToolMenu from './whiteboard/ToolMenu';
import { useToolStore } from '../store/toolStore';
import { useCanvasStore } from '../store/canvasStore';

export default function CanvasBoard({ roomId }) {
  const canvasRef = useRef(null);
  const { activeTool } = useToolStore();
  const { undo, redo, backgrounds } = useCanvasStore();

  useEffect(() => {
    const canvasEl = canvasRef.current;

    const paintBackground = () => {
      const ctx = canvasEl.getContext('2d');
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvasEl.width = width;
      canvasEl.height = height;

      // Use synced background color if exists, else fallback based on theme
      const isDark = document.documentElement.classList.contains('dark');
      const bgColor = backgrounds[roomId] || (isDark ? '#111827' : '#ffffff');

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
    };

    paintBackground();
    window.addEventListener('resize', paintBackground);

    // Update canvas background when theme changes (if no custom bg set)
    const observer = new MutationObserver(() => {
      if (!backgrounds[roomId]) paintBackground();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      window.removeEventListener('resize', paintBackground);
      observer.disconnect();
    };
  }, [roomId, backgrounds]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      if (ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      if ((ctrlKey && e.key === 'y') || (ctrlKey && e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="relative h-screen w-screen bg-white dark:bg-gray-900 text-black dark:text-white overflow-hidden">
      <div id="canvas-area" className="absolute inset-0 z-0">
        <canvas ref={canvasRef} className="w-full h-full" />
        <div className="fixed top-2 left-1/2 transform -translate-x-1/2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-5 py-2 rounded shadow z-50 text-sm font-medium text-center">
          <p className="mb-1">Room ID: {roomId}</p>
          <p className="mb-1">Active Tool: {activeTool}</p>
        </div>
      </div>

      <LeftMenu roomId={roomId} />
      <RightMenu />
      <BottomMenu canvasRef={canvasRef} />
      <ToolMenu />
    </div>
  );
}
