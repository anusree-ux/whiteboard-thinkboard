"use client";
import { useRouter } from "next/router";
import { nanoid } from "nanoid";
import { useState } from "react";
import Image from "next/image";
import logo from "../assets/logo.svg";
import buttonStyles from "../constants/buttonStyles";
import ThemeToggle from "./ThemeToggle";
import JoinModal from "./JoinModal";
import { Menu, X } from "lucide-react"; // ✅ Lucide icons

const Navbar = () => {
  const router = useRouter();
  const [toggle, setToggle] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleStart = () => {
    const roomId = nanoid(6); // generates unique room ID
    router.push(`/whiteboard/${roomId}`);
  };

  return (
    <>
      <nav className="flex justify-between items-center fixed top-0 left-0 right-0 pt-2 z-50 h-20 sm:px-16 px-6 transition-colors duration-500 bg-white dark:bg-gray-900 text-black dark:text-white shadow-lg backdrop-blur-md bg-opacity-20">
        {/* Logo */}
        <div className="flex items-center">
          <Image src={logo} alt="ThinkBoard" width={124} height={32} className="object-contain" />
        </div>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex gap-8 items-center text-primary font-medium">
          <li className="cursor-pointer hover:text-violet-900 transition">Github</li>
          <li>
            <button onClick={() => setShowModal(true)} className={buttonStyles.outline}>
              Join using ID
            </button>
          </li>
          <li>
            <button onClick={handleStart} className={buttonStyles.primary}>
              Try Whiteboard
            </button>
          </li>
          <li><ThemeToggle /></li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="sm:hidden flex items-center">
          <ul className="flex items-center gap-4">
            <li><ThemeToggle /></li>
            <li onClick={() => setToggle(!toggle)} className="cursor-pointer">
              {toggle ? (
                <X className="w-6 h-6 text-black dark:text-white" />
              ) : (
                <Menu className="w-6 h-6 text-black dark:text-white" />
              )}
            </li>
          </ul>
        </div>

        {/* Mobile Dropdown */}
        {toggle && (
          <div className="absolute top-16 right-4 text-white shadow-lg rounded-lg p-6 sm:hidden flex flex-col gap-4 bg-violet-gradient">
            <span className="cursor-pointer hover:text-violet-900">Github</span>
            <span onClick={() => setShowModal(true)} className="cursor-pointer hover:text-violet-900">
              Join using ID
            </span>
            <span onClick={handleStart} className="cursor-pointer hover:text-violet-900">
              Try Whiteboard
            </span>
          </div>
        )}
      </nav>

      {/* Join Modal */}
      <JoinModal show={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default Navbar;
