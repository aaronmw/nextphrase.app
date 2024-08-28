import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'
import plugin from 'tailwindcss/plugin'

const neutral = colors.slate

const borderColor = neutral['200']

const brandColor = colors.fuchsia

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        animateInX: 'animateInX 0.5s ease-in-out both',
        animateInY: 'animateInY 0.5s ease-in-out both',
        animateOutX: 'animateOutX 0.5s ease-in-out both',
        animateOutY: 'animateOutY 0.5s ease-in-out both',
      },
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
        brandColor,
        dangerColor: colors.red,
        fadedTextColor: brandColor['200'],
        infoColor: colors.blue,
        neutral,
        shadedBgColor: neutral['200'],
        successColor: colors.emerald,
        textColor: brandColor['50'],
        warningColor: colors.amber,
      },
      keyframes: {
        animateInX: {
          '0%': {
            opacity: '0',
            transform: 'translateX(100%)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        animateOutX: {
          '0%': {
            maxHeight: '200px',
            opacity: '1',
            transform: 'translateX(0%)',
          },
          '70%': {
            maxHeight: '200px',
            opacity: '0',
            transform: 'translateX(100%)',
          },
          '100%': {
            maxHeight: '0',
            opacity: '0',
            transform: 'translateX(100%)',
          },
        },

        animateInY: {
          '0%': {
            opacity: '0',
            transform: 'translateY(100%)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        animateOutY: {
          '0%': {
            opacity: '1',
            transform: 'translateY(0%)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(-100%)',
          },
        },
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
        },
        '*': {
          scrollbarColor: `${theme('colors.brandColor')} transparent`,
        },
        '*::-webkit-scrollbar': {
          height: theme('spacing.2'),
          width: theme('spacing.2'),
        },
        '*::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          background: theme('colors.brandColor'),
          borderRadius: theme('spacing.8'),
        },
        'a, button, input, textarea': {
          touchAction: 'manipulation',
        },
      })
    }),
    require('@tailwindcss/forms'),
  ],
}

export default config
