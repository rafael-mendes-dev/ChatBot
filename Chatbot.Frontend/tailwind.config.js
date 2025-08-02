/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        "chatbot-dark": {
          "primary": "#3b82f6",
          "primary-content": "#ffffff", 
          "secondary": "#8b5cf6",
          "secondary-content": "#ffffff",
          "accent": "#06b6d4",
          "accent-content": "#ffffff",
          "neutral": "#333537",
          "neutral-content": "#d3d8d4",
          "base-100": "#1e2020",
          "base-200": "#232425", 
          "base-300": "#282a2c",
          "base-content": "#ffffff",
          "info": "#3b82f6",
          "info-content": "#ffffff",
          "success": "#10b981",
          "success-content": "#ffffff",
          "warning": "#f59e0b", 
          "warning-content": "#000000",
          "error": "#ef4444",
          "error-content": "#ffffff",
        },
      },
    ],
    darkTheme: "chatbot-dark",
    base: true,
    styled: true,
    utils: true,
  },
}
