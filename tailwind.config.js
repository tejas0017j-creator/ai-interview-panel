/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        card: 'var(--card)',
        accent1: 'var(--accent1)',
        accent2: 'var(--accent2)',
        accent3: 'var(--accent3)',
        accent4: 'var(--accent4)',
      },
      fontFamily: {
        classic: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        serif: ['Playfair Display', 'Cormorant Garamond', 'serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        syne: ['Playfair Display', 'Cormorant Garamond', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
