/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'spin-reverse': 'spin-reverse 15s linear infinite',
        'spin-slower': 'spin 30s linear infinite',
        'spin-reverse-slow': 'spin-reverse 25s linear infinite',
      },
      keyframes: {
        'spin-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      },
      fontFamily: {
        'arabic': ['IBM Plex Sans Arabic', 'sans-serif'],
      },
    },
  },
  plugins: [],
  // corePlugins: {
  //   preflight: false,
  // },
};
