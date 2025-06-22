'use client';

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  // Load theme preference
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = saved === "dark" || (!saved && prefersDark);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  // Toggle handler
  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newDark);
  };

  return (
    <div
      onClick={toggleTheme}
      className="w-[72px] h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center px-1 cursor-pointer relative transition duration-300"
    >
      <div
        className={`absolute top-1 left-2 w-6 h-6 rounded-full bg-white dark:bg-black shadow-md transition-all duration-300 ${
          isDark ? "translate-x-[33px]" : "translate-x-0"
        }`}
      ></div>
      <div className="z-10 flex-1 flex items-center justify-center text-yellow-500 dark:text-gray-400">
        <Sun size={18} />
      </div>
      <div className="z-10 flex-1 flex items-center justify-center text-gray-600 dark:text-white">
        <Moon size={18} />
      </div>
    </div>
  );
};

export default ThemeToggle;
