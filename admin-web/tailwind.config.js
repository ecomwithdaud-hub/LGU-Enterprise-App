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
        lgu: {
          primary: '#0f2b48',
          secondary: '#1e3a8a',
          accent: '#10b981',
          gold: '#f59e0b',
        },
      },
    },
  },
  plugins: [],
};
