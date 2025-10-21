/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
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
        'plus-jakarta': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-login': 'linear-gradient(90deg, #000000 0%, #000000 3%, rgba(0,0,0,0.95) 6%, rgba(0,0,0,0.85) 10%, rgba(0,0,0,0.7) 15%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.3) 35%, rgba(0,0,0,0.15) 50%, transparent 70%)',
      },
    },
  },
  plugins: [],
}
