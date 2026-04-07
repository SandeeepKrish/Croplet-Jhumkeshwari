/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandLightMint: '#c1e5c3', // approximated from the Everyday Demifine Jewellery background
        brandDark: '#1a1a1a', 
      },
    },
  },
  plugins: [],
}
