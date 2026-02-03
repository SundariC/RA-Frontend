/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      Colors: {
        brand: "#FF4500", //Foodie Orange
        rich: "#1A1A1A",  //Deep Black
        cream: "#FDFDFD" //Background White
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif']
      }
    },
  },
  plugins: [],
}

