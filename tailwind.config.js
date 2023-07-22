/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "radial-gradient":
          "radial-gradient(ellipse closest-side,var(--tw-gradient-stops))",
      },
      colors: {
        accentColor: colors.emerald["600"],
        appBackgroundColor: colors.stone["50"],
        appBackgroundColorInDarkMode: colors.stone["900"],
        appForegroundColor: colors.stone["800"],
        appForegroundColorInDarkMode: colors.stone["50"],
        borderColor: colors.stone["200"],
        borderColorInDarkMode: colors.stone["600"],
        brandColor: colors.emerald["600"],
        fadedTextColor: colors.stone["500"],
        fadedTextColorInDarkMode: colors.stone["400"],
        highlightColor: colors.stone["200"],
        neutral: colors.stone,
        shadedColor: colors.stone["200"],
        shadedColorInDarkMode: colors.stone["800"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@headlessui/tailwindcss"),
  ],
};
