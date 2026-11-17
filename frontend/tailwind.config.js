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
        cyber: {
          950: '#030712',
          900: '#060D1E',
          850: '#0A1329',
          800: '#0E1B38',
          750: '#132448',
          700: '#1A2F5D',
          600: '#233F7D',
          500: '#3258A8',
        },
        neon: {
          cyan: '#00F0FF',
          teal: '#00E5BE',
          emerald: '#10B981',
          gold: '#F59E0B',
          blue: '#38BDF8',
          purple: '#818CF8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 240, 255, 0.5)' },
        }
      }
    },
  },
  plugins: [],
}
