import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        lato: ['var(--font-lato)', 'Lato', 'sans-serif'],
      },
      colors: {
        sand: '#F5EFE0',
        ink: '#1C1A14',
        muted: '#7A6F5A',
        accent: '#C0714A',
        accent2: '#4A7B8C',
        pale: '#EDE8DA',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
