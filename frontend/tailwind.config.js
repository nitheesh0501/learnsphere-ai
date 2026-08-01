/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crimson: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#dc2626', // Primary Accent
          700: '#b91c1c', // Primary Hover
          800: '#991b1b', // Dark Wine Accent
          900: '#7f1d1d',
          950: '#450a0a',
        },
        brand: {
          primary: '#DC2626',
          hover: '#B91C1C',
          dark: '#991B1B',
          light: '#FEE2E2',
          bg: '#F8FAFC',
          card: '#FFFFFF',
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
