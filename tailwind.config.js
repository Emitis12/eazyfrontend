/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#008BE0",     // Eazy Blue
        secondary: "#E6E6E6",   // Light Gray for backgrounds
      },
    },
  },
  plugins: [],
}
