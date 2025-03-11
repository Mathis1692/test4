// tailwind.config.js
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "/index.html",
  ],
  theme: {
    extend: {
      zIndex: {
        '50': '50',
      },
      keyframes: {
        pulse: {
          'from': { transform: 'scale(0.9)', opacity: '1' },
          'to': { transform: 'scale(1.8)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        'float-delay': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(-5deg)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(3deg)' },
        },
        'float-delay-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(-3deg)' },
        },
      },
      animation: {
        'pulse': 'pulse 1s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float-delay 7s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'float-delay-slow': 'float-delay-slow 9s ease-in-out infinite',
      },
      backgroundColor: {
        'purple-500/90': 'rgba(168, 85, 247, 0.9)',
      },
    },
  },
  plugins: [
    plugin(function({ addVariant }) {
      // Add variants for input label animations
      addVariant('peer-valid', ':merge(.peer):valid ~ &')
      addVariant('peer-placeholder-shown', ':merge(.peer):placeholder-shown ~ &')
    }),
  ],
}