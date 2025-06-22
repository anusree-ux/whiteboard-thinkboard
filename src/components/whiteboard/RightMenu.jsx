"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { sendReaction, onReceiveReaction, getSocket } from "../../lib/socket";
import ChatSidebar from "./ChatSideBar";
import { Info, MessageCircle } from "lucide-react";

const emojis = ["💖", "🎉", "🔥", "🤯", "✋", "👍"];

const RightMenu = () => {
  const router = useRouter();
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    if (router.query.id) {
      setRoomId(router.query.id);
    }
  }, [router.query.id]);

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const [reactionsOpen, setReactionsOpen] = useState(false);
  const [activeEmojis, setActiveEmojis] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleReactions = () => setReactionsOpen(!reactionsOpen);

  const handleEmojiClick = (emoji) => {
    const id = Date.now();

    const reactionData = {
      id,
      emoji,
      roomId,
      // sender: socket.id // optional: to filter own reactions
    };

    setActiveEmojis((prev) => [...prev, reactionData]);
    sendReaction(reactionData);

    setTimeout(() => {
      setActiveEmojis((prev) => prev.filter((r) => r.id !== id));
    }, 5000);
  };

  useEffect(() => {
    const handleReaction = (reaction) => {
      // Optional: skip self-reactions by comparing socket.id or other flag
      setActiveEmojis((prev) => [...prev, reaction]);

      setTimeout(() => {
        setActiveEmojis((prev) => prev.filter((r) => r.id !== reaction.id));
      }, 5000);
    };

    onReceiveReaction(handleReaction);

    return () => {
      try {
        const socket = getSocket();
        socket.off("receive-reaction", handleReaction);
      } catch (err) {
        console.warn("Socket cleanup failed:", err.message);
      }
    };
  }, []);

  return (
    <div className="flex h-screen transition-all duration-300">
      <div className={`flex-1 transition-all duration-300 ${isChatOpen ? "mr-80" : ""}`}>
        <div className="fixed top-4 right-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md z-50">
          <div className="relative inline-flex items-center gap-2 px-1 py-2">
            {/* Reaction Button */}
            <div className="relative">
              <button
                onClick={toggleReactions}
                className="p-1 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <Image src="/icons/reaction.svg" alt="Reaction" width={20} height={20} />
              </button>

              {reactionsOpen && (
                <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-48 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 flex justify-between">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleEmojiClick(emoji)}
                      className="text-xl hover:scale-125 transition"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Icon */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="p-1.5 text-white text-xs font-bold rounded-xl bg-primary hover:bg-purple-800 dark:hover:bg-purple-800 transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            {/* Room Info */}
            <button
              title="Room Info"
              onClick={toggleMenu}
              className="inline-flex items-center p-1.5 text-white bg-primary text-xs font-semibold rounded-xl hover:bg-purple-800 dark:hover:bg-purple-800 transition-all duration-300"
            >
              <Info className="w-4 h-4" />
              <span className="ml-1 hidden sm:inline">Room Info</span>
            </button>
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && roomId && (
          <div className="absolute top-20 right-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border dark:border-gray-700">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              <li className="px-4 py-2 flex items-center justify-between gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Room ID</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{roomId}</span>
              </li>
              <hr className="my-1 mx-2 border-gray-200 dark:border-gray-700" />
              <li className="px-4 py-2 flex items-center justify-between gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Participants</span>
                {/* Add participants logic here */}
              </li>
            </ul>
          </div>
        )}

        {/* Floating Emojis */}
        <div className="pointer-events-none fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
          {activeEmojis.map(({ id, emoji }) => (
            <motion.span
              key={id}
              initial={{ y: 0, opacity: 1, scale: 1 }}
              animate={{ y: -150, opacity: 0, scale: 1.5 }}
              transition={{ duration: 1.5 }}
              className="absolute text-4xl"
              style={{
                left: `${Math.random() * 80 - 40}px`,
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Chat Sidebar */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isChatOpen ? 0 : "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className={`fixed top-0 right-0 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl z-50 ${isChatOpen ? "block" : "hidden sm:block"}`}
      >
        {roomId && isChatOpen && (
          <ChatSidebar roomId={roomId} onClose={() => setIsChatOpen(false)} />
        )}
      </motion.div>
    </div>
  );
};

export default RightMenu;
