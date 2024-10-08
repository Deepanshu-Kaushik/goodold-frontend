/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'application-grey': '#f1f1f1',
        darkNight: '#071108',
        'dark-100': '#8b8b8b',
        'dark-200': '#717171',
        'dark-300': '#575757',
        'dark-400': '#3f3f3f',
        'dark-500': '#282828',
        'dark-600': '#121212',
        'mixed-100': '#908d96',
        'mixed-200': '#76737e',
        'mixed-300': '#5e5a66',
        'mixed-400': '#46424f',
        'mixed-500': '#2f2b3a',
        'mixed-600': '#1a1625',
        'primary-100': '#BEB6B2',
        'primary-200': '#818486',
        'primary-300': '#454A4E',
        'primary-400': '#303438',
        'primary-500': '#131C28',
        'primary-600': '#382bf0',
        'lord-100': '#444444',
        'lord-200': '#333333',
        'lord-300': '#222222',
        'lord-400': '#111111',
        'lord-500': '#000000',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
