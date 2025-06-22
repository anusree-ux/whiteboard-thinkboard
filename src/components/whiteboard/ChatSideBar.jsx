"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { sendChatMessage, onReceiveChat } from "@/lib/socket";

const ChatSidebar = ({ username = "User", roomId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const messagesEndRef = useRef(null);

  // Listen for incoming messages
  useEffect(() => {
    onReceiveChat((message) => {
      setMessages((prev) => [...prev, message]);
    });
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!msg.trim()) return;

    const messageData = {
      sender: username,
      text: msg,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    sendChatMessage({ roomId, message: messageData });
    setMessages((prev) => [...prev, messageData]);
    setMsg("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed right-0 top-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl dark:border-gray-700 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 font-semibold text-lg bg-gray-100 dark:bg-gray-800 flex justify-between items-center">
        Chat
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          &times;
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className="flex flex-col">
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {m.sender}
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                {m.timestamp}
              </span>
            </span>
            <span className="text-sm text-gray-800 dark:text-gray-200">{m.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
          />
          <button
            onClick={sendMessage}
            className="bg-primary text-white px-3 py-2 rounded-md text-sm hover:bg-purple-800 dark:hover:bg-purple-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatSidebar;
