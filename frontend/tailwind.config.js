/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fdf2f4',
          100: '#fbe5e9',
          200: '#f7ced7',
          300: '#f0a7b9',
          400: '#e47693',
          500: '#d34a6e',
          600: '#b82f53',
          700: '#701c34', // Deep College Maroon
          800: '#581427', // Maroon Hover
          900: '#4a1021', // Dark Burgundy Accent
          950: '#2b0611',
        },
        brand: {
          maroon: '#701C34',
          hover: '#581427',
          dark: '#4A1021',
          light: '#FDF2F4',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          sidebar: '#0F172A',
          text: '#0F172A',
          muted: '#475569'
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
