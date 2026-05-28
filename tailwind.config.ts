import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          DEFAULT: "#0A0A0A",
          soft: "#141414",
          medium: "#1E1E1E"
        },
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E8D5A3",
          deep: "#8A6820"
        },
        cream: "#F7F3EC",
        muted: "#6B6660"
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        editorial: ["var(--font-editorial)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Arial", "sans-serif"]
      },
      boxShadow: {
        gold: "0 18px 60px rgba(201, 168, 76, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
