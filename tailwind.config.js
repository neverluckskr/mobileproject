/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        dusk: '#05030a',
        accent: '#6ee7ff',
        blush: '#ff7c92'
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glass: '0 35px 80px rgba(0, 0, 0, 0.55)'
      },
      keyframes: {
        slideUp: {
          '0%': {
            opacity: 0,
            transform: 'translateY(48px)'
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)'
          }
        }
      },
      animation: {
        slideUp: 'slideUp 0.65s ease forwards'
      }
    }
  },
  plugins: []
}
