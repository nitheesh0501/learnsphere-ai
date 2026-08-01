/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#e0edff',
          200: '#c7dffff',
          300: '#9ec7ff',
          400: '#6ea5ff',
          500: '#3b7bfe',
          600: '#255bf4',
          700: '#1d46e1',
          800: '#1e3ab6',
          900: '#1e348f',
          950: '#0f172a',
        },
        dark: {
          bg: '#0b0f19',
          card: 'rgba(15, 23, 42, 0.75)',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(30, 41, 59, 0.8)'
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
