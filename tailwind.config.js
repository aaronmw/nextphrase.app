/** @type {import('tailwindcss').Config} */

import colors from "tailwindcss/colors"
import plugin from "tailwindcss/plugin"

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "radial-gradient":
          "radial-gradient(ellipse closest-side,var(--tw-gradient-stops))",
      },
      colors: {
        accentColor: colors.red,
        appBackgroundColor: colors.stone["900"],
        borderColor: colors.stone["600"],
        brandColor: colors.stone,
        fadedTextColor: colors.stone["200"],
        highlightColor: colors.stone["200"],
        neutral: colors.stone,
        shadedColor: colors.stone["950"],
        teamAColor: colors.red,
        teamBColor: colors.blue,
        textColor: colors.stone["100"],
      },
      fontFamily: {
        boogaloo: ["Boogaloo"],
      },
      gridTemplateAreas: {
        howToPlay: ["header", "content"],
        inGame: ["header", "phrase", "next"],
        intro: ["logo", "buttons"],
        lobby: ["header header", "left right", "start start"],
        settings: ["header", "content"],
      },
      gridTemplateColumns: {
        lobby: "1fr 1fr",
      },
      gridTemplateRows: {
        howToPlay: "1fr 9fr",
        intro: "2fr 1fr",
        lobby: "1fr 4fr 5fr",
        settings: "1fr 9fr",
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        "html": {
          backgroundColor: `${theme("colors.appBackgroundColor")}`,
          fontSize: "24px",
        },
        "*": {
          scrollbarColor: `${theme("colors.brandColor.500")} transparent`,
        },
        "*::-webkit-scrollbar": { width: theme("spacing.2") },
        "*::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "*::-webkit-scrollbar-thumb": {
          background: theme("colors.brandColor.500"),
        },
      })
    }),
    require("@savvywombat/tailwindcss-grid-areas"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@headlessui/tailwindcss"),
  ],
}
