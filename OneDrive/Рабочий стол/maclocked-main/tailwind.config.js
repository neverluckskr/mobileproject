/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "3rem",
        xl: "4rem",
      },
    },
    extend: {
      colors: {
        base: {
          50: "#f7f7f9",
          100: "#f0f1f4",
          200: "#dcdfe8",
          600: "#41465d",
          900: "#111320",
        },
        accent: {
          50: "#eef2ff",
          100: "#dae2ff",
          300: "#96a8ff",
          500: "#4f5bd5",
          600: "#3c46af",
          700: "#2a2f86",
        },
        sky: {
          50: "#ebf6ff",
          100: "#d4ecff",
          200: "#a8d8ff",
          400: "#5ab0ff",
        },
        slate: {
          800: "#1c2033",
          900: "#0f1422",
        },
        success: "#1ab87a",
        warning: "#f4b740",
      },
      boxShadow: {
        card: "0 8px 24px rgba(15, 23, 42, 0.08)",
      },
      fontFamily: {
        sans: ["'Inter'", "'Manrope'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
