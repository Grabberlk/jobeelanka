import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669", // Primary Trust Emerald
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        navy: {
          800: "#1e293b",
          900: "#0f172a", // Deep Slate Navy
          950: "#020617",
        },
        tealAccent: {
          500: "#0d9488",
        },
        amberGold: {
          500: "#f59e0b",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        bento: "0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
        "bento-hover": "0 20px 30px -10px rgba(5, 150, 105, 0.12), 0 10px 15px -3px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;

