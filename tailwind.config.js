/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Clash Display', 'system-ui', 'sans-serif'],
        'sans': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Pattern colors - nowa paleta bez fioletu
        'pattern-generator': '#14B8A6',    // teal - główna kategoria
        'pattern-simplifier': '#10B981',   // emerald
        'pattern-assistant': '#0EA5E9',    // sky
        'pattern-aggregator': '#FF6B00',   // brand orange (było amber)
        'pattern-monitor': '#F43F5E',      // rose
        'pattern-template': '#64748B',     // slate
        // Primary colors
        'primary': '#14B8A6',              // teal
        'accent': '#FF6B00',               // brand orange (było amber)
        // Brand orange palette
        'brand-orange': '#FF6B00',         // główny akcent z logo
        'brand-coral': '#FF8534',          // hover states
        'brand-deep': '#E55A00',           // active states
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(at 85% 15%, rgba(255, 107, 0, 0.12) 0px, transparent 45%), radial-gradient(at 40% 20%, rgba(20, 184, 166, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(14, 165, 233, 0.1) 0px, transparent 50%), radial-gradient(at 50% 50%, rgba(255, 107, 0, 0.06) 0px, transparent 60%)',
        'gradient-brand': 'linear-gradient(135deg, #14B8A6 0%, #FF6B00 100%)',
        'gradient-fire': 'linear-gradient(135deg, #FF6B00 0%, #FF8534 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'grain': 'grain 8s steps(10) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
      },
    },
  },
  plugins: [],
}
