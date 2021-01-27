// We use the default Next.js config, with tailwindcss added at the beginning
// https://nextjs.org/docs/advanced-features/customizing-postcss-config
module.exports = {
  plugins: [
    "tailwindcss",
    "postcss-flexbugs-fixes",
    [
      "postcss-preset-env", // this includes autoprefixer
      {
        autoprefixer: {
          flexbox: "no-2009",
        },
        stage: 3,
        features: {
          "custom-properties": false,
        },
      },
    ],
  ],
}
