import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          950: "#0f0a07",
          900: "#18100b",
          800: "#271911",
          700: "#3d2719",
          600: "#553723",
          500: "#744b30",
          400: "#996744",
        },
        retro: {
          red: "#b93826",
          crimson: "#8a1c14",
          mustard: "#d99b26",
          gold: "#f3b33a",
          amber: "#e68a1d",
          orange: "#dc602e",
          rust: "#a6401d",
          teal: "#216874",
          olive: "#3d5336",
          cream: "#f4eedb",
          aged: "#ebe1c7",
          parchment: "#d6c7a3",
          ink: "#1f1b16",
        },
        tape: {
          black: "#111112",
          chassis: "#1e1e20",
          acrylic: "#25272a",
          magnetic: "#3b2a1f",
          reel: "#f0e6d2",
          screw: "#7a7d84",
          gold: "#d4af37",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        mono: ["var(--font-share-tech-mono)", "Courier New", "monospace"],
        handwriting: ["var(--font-caveat)", "cursive"],
        hindi: ["var(--font-kalam)", "cursive"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      boxShadow: {
        cassette: "0 12px 28px -4px rgba(0, 0, 0, 0.65), 0 4px 12px -2px rgba(0, 0, 0, 0.4)",
        "cassette-hover": "0 22px 40px -6px rgba(0, 0, 0, 0.8), 0 8px 18px -4px rgba(217, 155, 38, 0.25)",
        shelf: "inset 0 6px 12px rgba(0, 0, 0, 0.7), 0 8px 16px rgba(0, 0, 0, 0.6)",
        deck: "0 24px 60px -12px rgba(0, 0, 0, 0.9), inset 0 2px 4px rgba(255, 255, 255, 0.1)",
        "amber-glow": "0 0 15px rgba(243, 179, 58, 0.5), 0 0 30px rgba(220, 96, 46, 0.3)",
      },
      animation: {
        "spin-slow": "spin 4s linear infinite",
        "spin-fast": "spin 1.2s linear infinite",
        "spin-reverse": "spin-reverse 4s linear infinite",
        "spin-fast-reverse": "spin-reverse 1.2s linear infinite",
        "vu-bounce-1": "vuBounce1 0.4s ease-in-out infinite alternate",
        "vu-bounce-2": "vuBounce2 0.35s ease-in-out infinite alternate",
        "tape-wobble": "tapeWobble 6s ease-in-out infinite",
        "flicker": "flicker 3s infinite",
        "float": "float 8s ease-in-out infinite",
      },
      keyframes: {
        "spin-reverse": {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        vuBounce1: {
          "0%": { transform: "rotate(-38deg)" },
          "30%": { transform: "rotate(-10deg)" },
          "60%": { transform: "rotate(15deg)" },
          "80%": { transform: "rotate(-5deg)" },
          "100%": { transform: "rotate(28deg)" },
        },
        vuBounce2: {
          "0%": { transform: "rotate(-35deg)" },
          "25%": { transform: "rotate(5deg)" },
          "50%": { transform: "rotate(-15deg)" },
          "75%": { transform: "rotate(22deg)" },
          "100%": { transform: "rotate(-8deg)" },
        },
        tapeWobble: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-4px) rotate(0.5deg)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
          "52%": { opacity: "0.95" },
          "54%": { opacity: "0.75" },
          "56%": { opacity: "0.98" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-10px) translateX(5px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
