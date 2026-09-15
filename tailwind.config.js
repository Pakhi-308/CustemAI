/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#178B5E",
          dark: "#12744D",
          light: "#E8F5EF",
        },
        ink: "#1A1A1A",
        muted: "#6B6B66",
        faint: "#8A8A84",
        border: "#E5E5E0",
        borderSoft: "#DEDEDA",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      keyframes: {
        gradientBG: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        fadeInUp: {
          from: { opacity: 0, transform: "translateY(15px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "75%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        gradientBG: "gradientBG 12s ease infinite",
        fadeInUp: "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        fadeIn: "fadeIn 0.4s ease-out",
        shake: "shake 0.4s ease-in-out",
      },
    },
  },
  plugins: [],
};
