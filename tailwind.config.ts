import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "400px",
      },
      colors: {
        shop: {
          950: "#0d0503",
          900: "#120806",
          850: "#180a06",
          800: "#1c0704",
          750: "#2b0b06",
          700: "#3d130a",
          600: "#571c10",
        },
        amber: {
          350: "#f5a524",
          450: "#f59e0b",
        },
        retro: {
          red: "#991b1b",
          crimson: "#7f1d1d",
          mustard: "#d97706",
          gold: "#f59e0b",
          amber: "#ea580c",
          cream: "#fef3c7",
          parchment: "#faf4e6",
          aged: "#f4eedb",
        },
      },
      fontFamily: {
        display: ["var(--font-rozha)", "Georgia", "serif"],
        hindi: ["var(--font-yatra)", "var(--font-rozha)", "serif"],
        sans: ["var(--font-space)", "sans-serif"],
        handwriting: ["var(--font-kalam)", "cursive"],
        mono: ["var(--font-mono-tech)", "monospace"],
      },
      boxShadow: {
        glass: "0 4px 16px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.15)",
        player: "0 25px 50px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.2)",
        glow: "0 0 24px rgba(245, 158, 11, 0.4)",
        cassette: "0 16px 36px rgba(0, 0, 0, 0.75), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
