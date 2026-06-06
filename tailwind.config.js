/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'primary-black': '#1c1b18',
        'accent-gold':   '#bfa37a',
        'light-beige':   '#f5efe4',
        'alabaster':     '#fbfbf9',
      },
    },
  },
  plugins: [],
}
