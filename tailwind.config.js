/** @type {import('tailwindcss').Config} */
// tailwind.config.js

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: "#694F8E" // Violet
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      screens: {
        xs: "480px",
        ss: "620px",
        sm: "768px",   // override if needed
        md: "1060px",
        lg: "1200px",
        xl: "1700px",
      },
    },
  },
  plugins: [],
};

