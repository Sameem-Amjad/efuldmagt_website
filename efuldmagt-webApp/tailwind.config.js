 
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
    "path-to-your-node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "path-to-your-node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom Colors
        primary: "#3CB4E4",
        primaryLight: "#10B981",
        secondary: "#246C89",
        danger: "#EF4444", // Red
        // Additional custom colors
        customGray: "#F3F3F3",
        customPurple: "#7C3AED",
      },
      textColor: {
        // Custom Text Colors
        primary: "#0D0D0D",
        secondary: "#3CB4E4",
        accent: "#F59E0B",
        danger: "#FF3D00",
        muted: "#525252", // Gray
      },
      fontSize: {
        // Custom Font Sizes
        xs: "10px", // 10px
        sm: "11px", // 11px
        base: "13px", // 13px
        md: "15px",
        lg: "18px", // 18px
        xl: "20px", // 20px
        "2xl": "25px", // 24px
        "3xl": "30px", // 30px
        "4xl": "2.25rem", // 36px
        "5xl": "3rem", // 48px
      },
      fontFamily: {
        // Custom Fonts
        sans: ["Montserrat", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
