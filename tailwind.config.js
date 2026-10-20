/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./script.js"],
  theme: {
    extend: {
      colors: {
        cream: "#FDFBF7",
        vintage: "#F3EFE0",
        olive: "#4A5D4E",
        "olive-dark": "#2C3A2E",
        brown: "#8C6D53",
        gold: "#D4AF37",
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        vintage: ["Cormorant Garamond", "serif"],
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
