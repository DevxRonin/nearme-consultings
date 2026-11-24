/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A1F44',
          light: '#132C5B',
          dark: '#06132B',
          800: '#102A56',
          900: '#0A1F44'
        },
        teal: {
          DEFAULT: '#00C2A8',
          hover: '#00A892',
          light: '#E6FAF7',
          50: '#F0FDFB',
          500: '#00C2A8',
          600: '#00A892'
        },
        gold: {
          DEFAULT: '#FFB800',
          hover: '#E5A500',
          light: '#FFF8E6',
          500: '#FFB800'
        },
        bodyBg: '#F8FAFC',
        textMain: '#172033',
        textMuted: '#64748B'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
};
