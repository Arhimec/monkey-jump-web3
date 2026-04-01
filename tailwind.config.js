/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#F5E6BE',
          DEFAULT: '#D4AF37',
          dark: '#996515',
          glow: '#FFD700',
        },
        charcoal: {
          light: '#262626',
          DEFAULT: '#1A1A1A',
          dark: '#0D0D0D',
        },
        danger: '#FF4136',
      },
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
        pixel: ['"Press Start 2P"', 'cursive'],
        mono: ['"Azeret Mono"', 'monospace'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #996515 100%)',
        'dark-gradient': 'linear-gradient(180deg, #1A1A1A 0%, #0D0D0D 100%)',
      },
    },
  },
  plugins: [],
};
