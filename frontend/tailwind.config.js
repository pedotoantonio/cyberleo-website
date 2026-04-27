/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyberleo': {
          gold: '#FFB800',
          blue: '#0099FF',
          orange: '#FF6B35',
          cyan: '#00D4FF',
          warm: '#FFF8E7',
          dark: '#2D2D2D'
        }
      },
      fontFamily: {
        'display': ['Nunito', 'sans-serif'],
        'body': ['Quicksand', 'sans-serif']
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px #FFB800, 0 0 10px #FFB800' },
          '50%': { boxShadow: '0 0 20px #FFB800, 0 0 30px #FFB800' }
        },
        sparkle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 }
        }
      }
    },
  },
  plugins: [],
}
