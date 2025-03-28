/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      display: ["Poppins", "sans-serif"],
    },
    extend: {
      //colors used in my project
      colors: {
        primary: "#00BCD4", 
        secondary: "#EF863E",
    },
    backgroundImage: {
      'login-bg-img': "url('/image/bg-image.png')",
      'signup-bg-img': "url('/image/signup-bg-img.png')"
    }
  },
  plugins: [],
  }

}