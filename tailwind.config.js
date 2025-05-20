/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'charlie-yellow': '#f6c425',
        'charlie-blue': '#1b294b',
        'charlie-orange': '#e86f2d',
        'charlie-lightblue': '#4cb8e2',
        'charlie-green': '#7dba6c',
        'charlie-purple': '#8e4a7f',
      },
      fontFamily: {
        'display': ['Lilita One', 'cursive'],
        'body': ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
