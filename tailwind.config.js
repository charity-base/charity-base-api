const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  purge: [
    "./components/**/*.js",
    "./components/**/*.tsx",
    "./components/**/*.mdx",
    "./pages/**/*.js",
    "./pages/**/*.tsx",
    "./pages/**/*.mdx",
  ],
  variants: {
    extend: {
      backgroundColor: ["active"],
      scale: ["active", "group-hover"],
      opacity: ["disabled"],
      cursor: ["disabled"],
    },
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
}
