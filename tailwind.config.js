/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        cyber: {
          bg:      '#0f172a',
          surface: '#131f35',
          card:    '#182035',
          border:  '#1e2d4a',
          cyan:    '#00e5ff',
          purple:  '#a855f7',
          green:   '#00ff88',
          yellow:  '#ffd600',
          orange:  '#ff6d00',
          red:     '#ff1744',
          muted:   '#4a5a7a',
          text:    '#c8d8f0',
        }
      },
      boxShadow: {
        'glow-cyan':   '0 0 20px rgba(0, 229, 255, 0.25)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.35)',
        'glow-green':  '0 0 20px rgba(0, 255, 136, 0.2)',
        'glow-red':    '0 0 20px rgba(255, 23, 68, 0.3)',
        'glow-orange': '0 0 20px rgba(255, 109, 0, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line':  'scanLine 2s ease-in-out infinite',
        'fade-in':    'fadeIn 0.5s ease-out',
        'slide-up':   'slideUp 0.5s ease-out',
      },
      keyframes: {
        scanLine: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.6' },
          '50%':      { transform: 'translateY(100%)', opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

