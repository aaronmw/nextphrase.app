/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "radial-gradient":
          "radial-gradient(ellipse closest-side,var(--tw-gradient-stops))",
      },
      colors: {
        accentColor: colors.orange["600"],
        appBackgroundColor: colors.green["900"],
        appForegroundColor: colors.stone["100"],
        borderColor: colors.slate["200"],
        brandColor: colors.green["600"],
        fadedTextColor: colors.green["200"],
        highlightColor: colors.stone["200"],
        neutral: colors.stone,
        shadedColor: colors.green["950"],
      },
      spacing: {
        barHeight: "8vh",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@headlessui/tailwindcss"),
  ],
};
