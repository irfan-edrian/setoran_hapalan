/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10b981', // Emerald 500
          600: '#059669', // Emerald 600
          700: '#047857', // Emerald 700
          800: '#065f46', // Emerald 800
          900: '#064e3b', // Emerald 900
          950: '#022c22', // Emerald 950
        }
      }
    },
  },
  plugins: [],
}
