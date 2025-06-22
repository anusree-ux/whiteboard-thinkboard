// LeftMenu.jsx
'use client';

import Link from "next/link";
import React, { useEffect, useState } from "react";
import ThemeToggle from "../ThemeToggle";
import { useCanvasStore } from "@/store/canvasStore";
import { getSocket } from "@/lib/socket";
import { Menu, ArrowLeft } from "lucide-react";

export default function LeftMenu({ roomId }) {
  const {
    titles,
    setTitle,
    updateTitleFromSocket,
    backgrounds,
    setBackground,
    updateBackgroundFromSocket,
  } = useCanvasStore();
  const title = titles[roomId] || "";

  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      socket.on("title-updated", ({ roomId: updatedRoomId, title }) => {
        updateTitleFromSocket(updatedRoomId, title);
      });
      socket.on("background-updated", ({ roomId: updatedRoomId, color }) => {
        updateBackgroundFromSocket(updatedRoomId, color);
      });
    }

    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      if (socket) {
        socket.off("title-updated");
        socket.off("background-updated");
      }
      observer.disconnect();
    };
  }, [roomId]);

  const lightColors = ["#FDE68A", "#A7F3D0", "#BFDBFE", "#FBCFE8", "#E0E7FF"];
  const darkColors = ["#1f2937", "#334155", "#4b5563", "#6b7280", "#9ca3af"];
  const currentColors = isDark ? darkColors : lightColors;

  const currentColor = backgrounds[roomId] || (isDark ? "#111827" : "#ffffff");

  return (
    <div className="fixed flex h-screen transition-all duration-300">
      <div className="absolute top-4 left-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-md z-50">
        <div className="relative inline-flex items-center gap-1 px-1 py-2 w-full">
          <Link href="/">
            <button
              aria-label="Back to home"
              className="inline-flex items-center gap-2 px-1 py-2 bg-white dark:bg-gray-800 text-black dark:text-white text-xs font-bold rounded-xl shadow-sm hover:bg-slate-200 dark:hover:bg-gray-700 transition-all duration-300"
              title="Back to Home"
            >
              <ArrowLeft className="w-3 h-3" />
            </button>
          </Link>

          <div className="relative block">
            <div
              onClick={toggleMenu}
              className="px-1 py-1.5 cursor-pointer rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <Menu className="w-4 h-4" />
            </div>

            {isOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border dark:border-gray-700">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li className="px-4 py-2 flex items-center justify-between gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Title</span>
                    <input
                      value={title}
                      onChange={(e) => setTitle(roomId, e.target.value)}
                      placeholder="Untitled Canvas"
                      className="w-48 px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm outline-none text-gray-800 dark:text-white"
                    />
                  </li>

                  <hr className="my-1 mx-2 border-gray-200 dark:border-gray-700" />

                  <li className="px-4 py-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <span className="text-sm font-medium">Theme</span>
                    <ThemeToggle />
                  </li>

                  <hr className="my-1 mx-2 border-gray-200 dark:border-gray-700" />

                  <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <div className="text-sm mb-1 text-gray-800 dark:text-gray-200">Canvas Background</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {currentColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setBackground(roomId, color)}
                          className={`w-5 h-5 rounded border border-gray-300 dark:border-gray-600 ${
                            currentColor === color ? 'ring-2 ring-primary' : ''
                          }`}
                          style={{ backgroundColor: color }}
                          title={`Color: ${color}`}
                        />
                      ))}
                      <input
                        type="text"
                        placeholder="#FFFFFF"
                        maxLength={7}
                        className="w-20 px-2 py-1 rounded text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white outline-none"
                        title="Enter hex color code"
                        disabled
                      />
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}