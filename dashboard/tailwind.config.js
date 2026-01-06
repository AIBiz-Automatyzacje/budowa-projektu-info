/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pattern colors - nowa paleta bez fioletu
        'pattern-generator': '#14B8A6',    // teal - główna kategoria
        'pattern-simplifier': '#10B981',   // emerald
        'pattern-assistant': '#0EA5E9',    // sky
        'pattern-aggregator': '#F59E0B',   // amber
        'pattern-monitor': '#F43F5E',      // rose
        'pattern-template': '#64748B',     // slate
        // Primary colors
        'primary': '#14B8A6',              // teal
        'accent': '#F59E0B',               // amber
      }
    },
  },
  plugins: [],
}
