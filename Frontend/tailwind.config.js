/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Garante que lê componentes e páginas
  ],
  theme: {
    extend: {
      colors: {
        'moura-blue': '#003366',
        'moura-orange': '#F2A933',
      }
    },
  },
  plugins: [],
}