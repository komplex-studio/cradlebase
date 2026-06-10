/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Electric blue accent
        brand: {
          DEFAULT: "#2563eb",
          dark: "#1d4ed8",
          light: "#dbe6ff",
        },
        // Deep navy ink for headlines
        ink: {
          DEFAULT: "#172554",
          soft: "#33406b",
        },
        // Warm magazine neutrals
        paper: "#f8f5ef",
        line: "#e7e1d5",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "44rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(23,37,84,0.04), 0 12px 28px -18px rgba(23,37,84,0.25)",
      },
    },
  },
  plugins: [],
};
