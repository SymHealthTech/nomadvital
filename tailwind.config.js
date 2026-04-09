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
        forest: {
          DEFAULT: '#085041',
          light: '#0F6E56',
        },
        vital: {
          DEFAULT: '#1D9E75',
          light: '#5DCAA5',
          pale: '#E1F5EE',
        },
        amber: {
          DEFAULT: '#EF9F27',
          pale: '#FAEEDA',
        },
        warm: {
          DEFAULT: '#F1EFE8',
        },
        gray: {
          card: '#D3D1C7',
          muted: '#888780',
          sub: '#5F5E5A',
        },
      },
      fontFamily: {
        inter:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'heading-xl': '0.02em',
        'heading-lg': '0.015em',
        'heading-md': '0.01em',
        'heading-sm': '0.005em',
      },
      lineHeight: {
        'heading':    '1.25',
        'heading-md': '1.3',
        'heading-sm': '1.35',
        'body':       '1.7',
        'loose':      '1.8',
      },
    },
  },
  plugins: [],
}
