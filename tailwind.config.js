const colors = require("tailwindcss/colors");

module.exports = {
  purge: {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],

    // safelist,
  },
  darkMode: "class", // or 'media' or 'class'
  theme: {
    colors: { ...colors },
    maxWidth: {
      "1/4": "25%",
      "1/2": "50%",
      "3/4": "75%",
    },
    screens: {
      mobile: { max: "425px" },
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    fontFamily: {
      inter: ["Inter", "serif"],
      poppins: ["Poppins"],
      nunito: ["Nunito"],
      montserrat: ["Montserrat"],
    },
    extend: {
      colors: {
        accent: "rgb(250, 222, 42)",
        primary: "rgb(44, 75, 255)",
        warn: "rgb(233, 114, 132)",
        black: {
          100: "#cdd0d6",
          200: "#9ba2ae",
          300: "#687385",
          400: "#36455d",
          500: "#041634",
          600: "#03122a",
          700: "#020d1f",
          800: "#020915",
          900: "#01040a",
        },
      },
      fontSize: {
        xxs: "0.625rem",
        "7xl": "5rem",
        "8xl": "6rem",
        "9xl": "7rem",
        "10xl": "8rem",
      },
      borderWidth: {
        0.5: ".5px",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
