/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./{about,portfolio,rate,writings}/**/*.html", "./js/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        wood: {
          50: "#efebe9",
          100: "#d7ccc8",
          200: "#bcaaa4",
          300: "#a1887f",
          400: "#8d6e63",
          500: "#795548",
          600: "#6d4c41",
          700: "#5d4037",
          800: "#4e342e",
          900: "#3e2723",
          accent: "#8D6E63",
          muted: "#A1887F",
        },
        grey: {
          dark: "#212121",
          light: "#F5F5F5",
          slate: "#374151",
          soft: "#9CA3AF",
        },
      },
      typography: (theme) => ({
        wood: {
          css: {
            "--tw-prose-links": theme("colors.wood.accent"),
            "--tw-prose-bold": theme("colors.wood.accent"),
            "--tw-prose-headings": theme("colors.gray.900"),
            "--tw-prose-invert-headings": theme("colors.white"),
            "--tw-prose-invert-links": theme("colors.wood.accent"),
            "--tw-prose-invert-bold": theme("colors.wood.accent"),
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
