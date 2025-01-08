/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        }, // Fix this missing closing brace
      },
      animation: {
        blink: 'blink 1s infinite ease-in-out',
        fade: 'fadeIn .5s ease-in-out',
        pulse: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      fontFamily: {
        bebas: ['"Bebas Neue"'],
      },
      colors: {
        primary: '#1A202C',
        secondary: '#718096',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Example custom utility for ::selection
    function ({ addUtilities }) {
      addUtilities({
        '::selection': {
          backgroundColor: '#000000',
          color: '#ffffff',
        },
      });
    },
  ],
};

