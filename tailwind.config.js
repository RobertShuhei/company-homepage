/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        navy: 'var(--navy)',
        gray: 'var(--gray)',
        teal: 'var(--teal)',
        'light-gray': 'var(--light-gray)',
        border: 'var(--border)',
        primary: 'var(--navy)',
        secondary: 'var(--teal)',
        muted: 'var(--gray)',
        surface: 'var(--light-gray)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}