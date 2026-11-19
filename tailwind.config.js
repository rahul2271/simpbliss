/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#15091C',    /* Deep plum, near-black */
        'brand-light': '#F9F7FA',   /* Pearl white */
        'brand-gold': '#C8A97E',    /* Antique gold */
        'brand-accent': '#381C47',  /* Velvet purple */
        'brand-muted': '#EBE5F0',   /* Soft lilac-grey */
        'brand-ink': '#0E0612',     /* Deepest plum for footers / preloader */
      },
      fontFamily: {
        // Loaded in app/layout.jsx via next/font (CSS variables)
        serif: ['var(--font-display)', 'Cormorant Garamond', 'Didot', 'serif'],
        sans: ['var(--font-body)', 'Jost', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'luxe': '0.32em',
      },
      transitionTimingFunction: {
        'luxe': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
