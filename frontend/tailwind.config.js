/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkSlate: '#0F1117',
        primaryAccent: '#6366f1',
      }
    },
  },
  plugins: [],
}
