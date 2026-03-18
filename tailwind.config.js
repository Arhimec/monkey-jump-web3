/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        jungle: {
          dark: '#0d1f0a',
          green: '#7ab82b',
          deep: '#1a3a0e',
        },
        banana: '#FFD700',
        danger: '#ff4466',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        mono: ['"Azeret Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
