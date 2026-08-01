/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        ink: {
          950: '#0B1B1E',
          900: '#122B2F',
          800: '#1B3C41',
          700: '#28575E',
        },
        brass: {
          400: '#D8B26A',
          500: '#C79A4B',
          600: '#A87C33',
        },
        clay: {
          500: '#B5563C',
        },
        linen: '#F6F2EA',
        mist: '#EEF2F1',
      },
      boxShadow: {
        panel: '0 1px 0 rgba(11,27,30,0.06), 0 8px 24px -12px rgba(11,27,30,0.18)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}


