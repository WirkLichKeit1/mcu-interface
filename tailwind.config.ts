import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0f1117",
          1: "#16191f",
          2: "#1c2028",
          3: "#242832",
        },
        border: "#2a2f3a",
        muted: "#6b7280",
        accent: {
          DEFAULT: "#e5383b",
          hover: "#c1121f",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;