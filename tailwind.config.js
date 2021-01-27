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
    },
    cursor: ["responsive", "disabled"],
    opacity: ["responsive", "hover", "focus", "disabled", "group-hover"],
    scale: ["responsive", "hover", "focus", "active", "group-hover"],
    opacity: ["responsive", "hover", "focus"],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
}
