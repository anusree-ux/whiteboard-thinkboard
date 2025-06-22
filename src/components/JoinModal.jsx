"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

export default function JoinModal({ show, onClose }) {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const modalRef = useRef(null);

  const validateRoomId = (id) => {
    // Example rule: at least 6 alphanumeric characters
    const pattern = /^[a-zA-Z0-9_-]{6,}$/;
    return pattern.test(id);
  };

  const handleJoin = () => {
    if (roomId.trim() === "") {
      setError("Room ID cannot be empty.");
      return;
    }

    if (!validateRoomId(roomId)) {
      setError("Invalid Room ID. Use at least 6 characters (letters, numbers, - or _).");
      return;
    }

    // All good: navigate and close
    setError("");
    router.push(`/whiteboard/${roomId}`);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full relative"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Enter Room ID
        </h2>

        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => {
            setRoomId(e.target.value);
            setError("");
          }}
          className={`w-full p-3 rounded-md border ${
            error ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-violet-500 mb-2 dark:bg-gray-700 dark:text-white`}
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleJoin}
            className="px-4 py-2 text-sm bg-[#694F8E] text-white rounded hover:opacity-90"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
// This modal allows users to enter a room ID to join an existing whiteboard session.
