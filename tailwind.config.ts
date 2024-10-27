import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'
import plugin from 'tailwindcss/plugin'

const neutral = colors.slate
const primaryColor = colors.rose
const secondaryColor = colors.sky
export const teamAColor = colors.amber
export const teamBColor = colors.sky
const borderColor = `rgb(from ${neutral['500']} r g b / 0.1)`

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial':
          'radial-gradient(closest-side, var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderColor: {
        DEFAULT: borderColor,
      },
      colors: {
        bgColor: neutral['950'],
        borderColor,
        primaryColor,
        secondaryColor,
        dangerColor: colors.red,
        fadedTextColor: primaryColor['500'],
        infoColor: colors.blue,
        neutral,
        shadedBgColor: borderColor,
        successColor: colors.emerald,
        teamAColor,
        teamBColor,
        textColor: primaryColor['50'],
        warningColor: colors.amber,
      },
    },
    fontFamily: {
      body: ['var(--font-inter)', 'sans-serif'],
      icon: ["'Font Awesome 6 Pro'"],
      mono: ['monospace'],
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        'html': {
          scrollPaddingTop: theme('spacing.12'),
          scrollBehavior: 'smooth',
          overflowX: 'hidden',
          backgroundColor: theme('colors.bgColor'),
          color: theme('colors.textColor'),
          fontSize: '32px',
          overscrollBehavior: 'none',
          overflow: 'hidden',
        },
        '*': {
          scrollbarColor: `${theme('colors.primaryColor[500]')} transparent`,
        },
        '*::-webkit-scrollbar': {
          height: theme('spacing.2'),
          width: theme('spacing.2'),
        },
        '*::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          background: theme('colors.primaryColor[500]'),
          borderRadius: theme('spacing.8'),
        },
        'a, button, input, textarea': {
          touchAction: 'manipulation',
        },
      })
    }),
    require('tailwindcss-3d'),
    require('@tailwindcss/forms'),
  ],
}

export default config
