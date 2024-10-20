/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', '!./node_modules'],
  theme: {
    fontFamily: {
      avenir: ['sans-serif'],
    },
    colors: {
      hck: {
        main: '#6956E5',
        white: '#ffffff',
        black: '#000000',
        grey: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          300: "#CCCCCC",
          400: "#AFAFAF",
          500: "#8F8F8F",
          600: "#333333",
        },
        borderGrey: "rgba(0, 0, 0, 0.08)",
        borderDarkGrey: "rgba(0, 0, 0, 0.40)",
        borderLightGrey: "rgba(0, 0, 0, 0.10)",
        red: "#FF0000",
        green: {
          100: "#D2E9D7",
          400: "#00A05E",
        },
        orange: "#FF881B",
      },
    },
    extend: {
      boxShadow: {
        hck: '0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #F4EBFF',
        danger: ' 0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #FEE4E2',
        gray: 'box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #F2F4F7',
      },
      backgroundColor: ['even'],
      backgroundImage: {
        'grd': "linear-gradient(108deg, #04001C 0%, #621DBA 48.44%, #8676EE 100%)"
      },
    },
  },
  variants: {
    extend: {
      display: ['group-focus']
    }
  },
  plugins: [
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/line-clamp'),
    // require("daisyui"),
  ],
}