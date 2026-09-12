/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#0a0a0a',
        'dark-secondary': '#1a1a1a',
        'dark-tertiary': '#2a2a2a',
        'accent': '#3b82f6',
        'accent-light': '#60a5fa',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        'gradient-accent': 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
        'gradient-accent-dark': 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { textShadow: '0 0 10px rgba(59, 130, 246, 0.5)' },
          '50%': { textShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
        },
      },
      transform: {
        'translate-z-20': 'translateZ(20px)',
        'rotate-x-5': 'rotateX(5deg)',
        'rotate-y-5': 'rotateY(5deg)',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    function ({ addVariant }) {
      addVariant('light', ['html.light &', '.light &'])
    },
  ],
}


