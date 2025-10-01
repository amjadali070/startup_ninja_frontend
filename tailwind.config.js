/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          red: '#E50000',
          dark: '#1A1A1A',
          black: '#000000',
        },
        secondary: {
          red: '#A04040',
          grey: '#333333',
          lightGrey: '#4A4A4A',
          placeholder: '#888888',
        },
        text: {
          white: '#FFFFFF',
          light: '#F5F5F5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
