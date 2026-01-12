/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'nature-green': '#5F6F3A',
        'nature-brown': '#A05A2C',
        'nature-cream': '#F9F7F0',
        'nature-light': '#FFFDF5',
      },
    },
  },
  plugins: [],
}
