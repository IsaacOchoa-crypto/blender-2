/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0d0e12',
          card: 'rgba(18, 20, 29, 0.6)',
          border: 'rgba(255, 255, 255, 0.08)',
          glow: 'rgba(99, 102, 241, 0.15)',
          primary: '#6366f1', // Indigo
          secondary: '#ec4899', // Pink
          accent: '#10b981', // Emerald
          text: '#f3f4f6',
          muted: '#9ca3af'
        }
      },
      boxShadow: {
        'glass-sm': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'cyber-glow': '0 0 20px rgba(99, 102, 241, 0.3)',
        'cyber-glow-pink': '0 0 20px rgba(236, 72, 153, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
