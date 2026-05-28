/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // You can keep this if you still have it
    "./src/**/*.{js,ts,jsx,tsx}", // Catches your old Vite components
    "./app/**/*.{js,ts,jsx,tsx}", // ADD THIS: Catches the new Next.js App Router
    "./pages/**/*.{js,ts,jsx,tsx}", // ADD THIS (optional): If you use the Pages router
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}