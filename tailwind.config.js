/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container:{
      center:true,
    },
    extend: {
      
      height:{
        '100':'44rem',
      },
      screens:{
        'sm':'330px'
      }
    },
  },
  plugins: [],
}

