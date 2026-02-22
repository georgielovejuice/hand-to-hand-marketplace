/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        caramellatte: {
          "primary": "#F37E00",
          "primary-content": "#FFF6E5",
          "secondary": "#FFCA8D",
          "secondary-content": "#6A3E00",
          "accent": "#6A4A00",
          "accent-content": "#FFF6E5",
          "neutral": "#4A2D00",
          "neutral-content": "#FFF6E5",
          "base-100": "#FFF8EC",
          "base-200": "#F3FED3",
          "base-300": "#FDE6C7",
          "base-content": "#4A2D00",
          "info": "#7A9E7E",
          "success": "#6FA26B",
          "warning": "#E6B566",
          "error": "#B13B00",
        },
      },
    ],
  },
}