/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0D0D0D',
        surface: '#1A1A1A',
        admin: '#141414',
        gold: {
          DEFAULT: '#C9A84C',
          dark: '#B8860B',
          light: '#FFD700',
        },
        ivory: '#FAF8F0',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
