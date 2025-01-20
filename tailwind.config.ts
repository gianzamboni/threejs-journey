import type { Config } from 'tailwindcss'

export default {
  content: [
    "./src/**/*.{html,ts,js}",
  ],
  theme: {
    extend: {
      colors: {
        "alpha-black": 'rgba(255, 255, 255, 0.5)',
      }
    },
  },
  darkMode: 'selector',
  plugins: [
  ],
} satisfies Config

