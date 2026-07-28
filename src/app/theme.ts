export const appBackgroundColor = '#000000'

export const colorShades = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const

export const THEME_COLORS_CHANGED_EVENT = 'nextphrase:theme-colors-changed'
export const TEXT_ON_ACCENT_COLOR_TOKEN = '--color-textOnAccentColor'
export const TEXT_ON_TEAM_A_COLOR_TOKEN = '--color-textOnTeamAColor'
export const TEXT_ON_TEAM_B_COLOR_TOKEN = '--color-textOnTeamBColor'

export type ColorShade = (typeof colorShades)[number]

type LinearSrgbColor = [red: number, green: number, blue: number]
type ColorScale = Record<ColorShade, string>

const surfaceColorShades = [500, 600, 700, 800, 900, 950] as const
const textColorShades = [500, 400, 300, 200, 100, 50] as const
const minimumTextContrastRatio = 4.5

function createColorTokenScale(tokenName: string) {
  return Object.fromEntries(
    colorShades.map(shade => [shade, `var(--color-${tokenName}-${shade})`]),
  ) as Record<ColorShade, string>
}

function clampColorChannel(channel: number) {
  return Math.min(1, Math.max(0, channel))
}

function convertSrgbChannelToLinear(channel: number) {
  return channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4
}

function parseHexColor(color: string): LinearSrgbColor | null {
  const match = color.match(/^#([\da-f]{3}|[\da-f]{6})$/i)
  if (!match) return null

  const digits =
    match[1].length === 3
      ? [...match[1]].map(digit => `${digit}${digit}`).join('')
      : match[1]
  const channels = [
    Number.parseInt(digits.slice(0, 2), 16),
    Number.parseInt(digits.slice(2, 4), 16),
    Number.parseInt(digits.slice(4, 6), 16),
  ]

  return channels.map(channel =>
    convertSrgbChannelToLinear(channel / 255),
  ) as LinearSrgbColor
}

function parseRgbColor(color: string): LinearSrgbColor | null {
  const match = color.match(/^rgba?\((.*)\)$/i)
  if (!match) return null

  const channels = match[1]
    .split('/')[0]
    .trim()
    .split(/[\s,]+/)
    .slice(0, 3)

  if (channels.length !== 3) return null

  const parsedChannels = channels.map(channel => {
    const value = Number.parseFloat(channel)
    if (!Number.isFinite(value)) return Number.NaN

    return channel.endsWith('%') ? value / 100 : value / 255
  })

  if (parsedChannels.some(channel => Number.isNaN(channel))) return null

  return parsedChannels.map(channel =>
    convertSrgbChannelToLinear(clampColorChannel(channel)),
  ) as LinearSrgbColor
}

function parseOklchColor(color: string): LinearSrgbColor | null {
  const match = color.match(/^oklch\((.*)\)$/i)
  if (!match) return null

  const [lightnessValue, chromaValue, hueValue] = match[1]
    .split('/')[0]
    .trim()
    .split(/\s+/)

  if (!lightnessValue || !chromaValue || !hueValue) return null

  const lightness =
    Number.parseFloat(lightnessValue) / (lightnessValue.endsWith('%') ? 100 : 1)
  const chroma = chromaValue === 'none' ? 0 : Number.parseFloat(chromaValue)
  const hue =
    hueValue === 'none' ? 0 : (Number.parseFloat(hueValue) * Math.PI) / 180

  if (![lightness, chroma, hue].every(Number.isFinite)) return null

  const a = chroma * Math.cos(hue)
  const b = chroma * Math.sin(hue)
  const lPrime = lightness + 0.3963377774 * a + 0.2158037573 * b
  const mPrime = lightness - 0.1055613458 * a - 0.0638541728 * b
  const sPrime = lightness - 0.0894841775 * a - 1.291485548 * b
  const l = lPrime ** 3
  const m = mPrime ** 3
  const s = sPrime ** 3

  // OKLab is D65-based, so these channels convert directly to linear sRGB.
  return [
    clampColorChannel(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    clampColorChannel(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    clampColorChannel(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ]
}

function parseLabColor(color: string): LinearSrgbColor | null {
  const match = color.match(/^lab\((.*)\)$/i)
  if (!match) return null

  const [lightnessValue, aValue, bValue] = match[1]
    .split('/')[0]
    .trim()
    .split(/\s+/)

  if (!lightnessValue || !aValue || !bValue) return null

  const lightness = Number.parseFloat(lightnessValue)
  const a =
    (aValue === 'none' ? 0 : Number.parseFloat(aValue)) *
    (aValue.endsWith('%') ? 1.25 : 1)
  const b =
    (bValue === 'none' ? 0 : Number.parseFloat(bValue)) *
    (bValue.endsWith('%') ? 1.25 : 1)

  if (![lightness, a, b].every(Number.isFinite)) return null

  const f1 = (lightness + 16) / 116
  const f0 = a / 500 + f1
  const f2 = f1 - b / 200
  const epsilon = 216 / 24389
  const kappa = 24389 / 27
  const convertLabComponent = (component: number) =>
    component ** 3 > epsilon ? component ** 3 : (116 * component - 16) / kappa

  const xD50 = convertLabComponent(f0) * 0.96422
  const yD50 = convertLabComponent(f1)
  const zD50 = convertLabComponent(f2) * 0.82521

  // CSS Lab is D50-based; adapt to D65 before converting to linear sRGB.
  const xD65 =
    0.9554734527042182 * xD50 -
    0.023098536874261423 * yD50 +
    0.0632593086610217 * zD50
  const yD65 =
    -0.028369706963208136 * xD50 +
    1.0099954580058226 * yD50 +
    0.021041398966943008 * zD50
  const zD65 =
    0.012314001688319899 * xD50 -
    0.020507696433477912 * yD50 +
    1.3303659366080753 * zD50

  return [
    clampColorChannel(
      3.2409699419045226 * xD65 -
        1.537383177570094 * yD65 -
        0.4986107602930034 * zD65,
    ),
    clampColorChannel(
      -0.9692436362808796 * xD65 +
        1.8759675015077202 * yD65 +
        0.04155505740717559 * zD65,
    ),
    clampColorChannel(
      0.05563007969699366 * xD65 -
        0.20397695888897652 * yD65 +
        1.0569715142428786 * zD65,
    ),
  ]
}

function getRelativeLuminance(color: string) {
  const normalizedColor = color.trim().toLowerCase()
  const channels =
    parseHexColor(normalizedColor) ??
    parseRgbColor(normalizedColor) ??
    parseOklchColor(normalizedColor) ??
    parseLabColor(normalizedColor)

  if (!channels) return null

  const [red, green, blue] = channels
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

export function getColorContrastRatio(
  foregroundColor: string,
  backgroundColor: string,
) {
  const foregroundLuminance = getRelativeLuminance(foregroundColor)
  const backgroundLuminance = getRelativeLuminance(backgroundColor)

  if (foregroundLuminance === null || backgroundLuminance === null) {
    return null
  }

  return (
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  )
}

export function getTextOnAccentColor(
  accentColor: string,
  neutralColor: string,
) {
  const darkContrast = getColorContrastRatio(appBackgroundColor, accentColor)
  const lightContrast = getColorContrastRatio(neutralColor, accentColor)

  if (darkContrast === null || lightContrast === null) return neutralColor

  return darkContrast >= lightContrast ? appBackgroundColor : neutralColor
}

export function getReadableColorSurface(
  colorScale: ColorScale,
  neutralColor: string,
) {
  for (const shade of surfaceColorShades) {
    const backgroundColor = colorScale[shade]
    const contrastRatio = getColorContrastRatio(neutralColor, backgroundColor)

    if (contrastRatio !== null && contrastRatio >= minimumTextContrastRatio) {
      return {
        backgroundColor,
        contrastRatio,
        shade,
        textColor: neutralColor,
      }
    }
  }

  const shade = surfaceColorShades.at(-1)!
  const backgroundColor = colorScale[shade]

  return {
    backgroundColor,
    contrastRatio:
      getColorContrastRatio(
        getTextOnAccentColor(backgroundColor, neutralColor),
        backgroundColor,
      ) ?? 0,
    shade,
    textColor: getTextOnAccentColor(backgroundColor, neutralColor),
  }
}

export function getReadablePaletteTextColor(
  colorScale: ColorScale,
  backgroundColor = appBackgroundColor,
) {
  for (const shade of textColorShades) {
    const color = colorScale[shade]
    const contrastRatio = getColorContrastRatio(color, backgroundColor)

    if (contrastRatio !== null && contrastRatio >= minimumTextContrastRatio) {
      return { color, contrastRatio, shade }
    }
  }

  const shade = textColorShades.at(-1)!
  const color = colorScale[shade]

  return {
    color,
    contrastRatio: getColorContrastRatio(color, backgroundColor) ?? 0,
    shade,
  }
}

export function resolveCssColor(color: string) {
  if (typeof document === 'undefined') return color

  const variableName = color.match(/^var\((--[^)]+)\)$/)?.[1]
  if (!variableName) return color

  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim() || color
  )
}

export function applyTextOnAccentColor(
  accentColor = resolveCssColor('var(--color-accentFillColor)'),
  neutralColor = resolveCssColor('var(--color-neutralColor-100)'),
) {
  if (typeof document === 'undefined') return

  document.documentElement.style.setProperty(
    TEXT_ON_ACCENT_COLOR_TOKEN,
    getTextOnAccentColor(accentColor, neutralColor),
  )
}

interface TextOnThemeColors {
  accentColor?: string
  neutralColor?: string
  teamAColor?: string
  teamBColor?: string
}

export function applyTextOnThemeColors({
  accentColor = resolveCssColor('var(--color-accentFillColor)'),
  neutralColor = resolveCssColor('var(--color-neutralColor-100)'),
  teamAColor = resolveCssColor('var(--color-teamAFillColor)'),
  teamBColor = resolveCssColor('var(--color-teamBFillColor)'),
}: TextOnThemeColors = {}) {
  if (typeof document === 'undefined') return

  applyTextOnAccentColor(accentColor, neutralColor)

  const rootStyle = document.documentElement.style
  rootStyle.setProperty(
    TEXT_ON_TEAM_A_COLOR_TOKEN,
    getTextOnAccentColor(teamAColor, neutralColor),
  )
  rootStyle.setProperty(
    TEXT_ON_TEAM_B_COLOR_TOKEN,
    getTextOnAccentColor(teamBColor, neutralColor),
  )
}

export const teamAColor = createColorTokenScale('teamAColor')
export const teamBColor = createColorTokenScale('teamBColor')
export const teamAFillColor = 'var(--color-teamAFillColor)'
export const teamBFillColor = 'var(--color-teamBFillColor)'
