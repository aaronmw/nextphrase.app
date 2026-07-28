import {
  applyTextOnThemeColors,
  colorShades,
  ColorShade,
  getReadableColorSurface,
  getReadablePaletteTextColor,
  THEME_COLORS_CHANGED_EVENT,
} from '@/app/theme'
import tailwindColors from 'tailwindcss/colors'

type TailwindColors = typeof tailwindColors
type ScalableTailwindColorName = {
  [Name in keyof TailwindColors]: TailwindColors[Name] extends Record<
    '50' | '500' | '950',
    string
  >
    ? Name
    : never
}[keyof TailwindColors]

type ColorScale = Record<ColorShade, string>

export interface DevThemePreview {
  accent: ScalableTailwindColorName
  teamA: ScalableTailwindColorName
  teamB: ScalableTailwindColorName
  neutral: ScalableTailwindColorName
}

export const DEV_THEME_PRESETS = [
  {
    id: 'default',
    label: 'Default',
    palette: {
      accent: 'rose',
      teamA: 'rose',
      teamB: 'sky',
      neutral: 'stone',
    },
  },
  {
    id: '1986',
    label: '1986',
    palette: {
      accent: 'violet',
      teamA: 'teal',
      teamB: 'pink',
      neutral: 'slate',
    },
  },
  {
    id: 'ho-ho-ho',
    label: 'Ho Ho Ho',
    palette: {
      accent: 'emerald',
      teamA: 'red',
      teamB: 'emerald',
      neutral: 'slate',
    },
  },
] as const satisfies readonly {
  id: string
  label: string
  palette: DevThemePreview
}[]

export type DevThemePreset = (typeof DEV_THEME_PRESETS)[number]
export type DevThemePresetId = DevThemePreset['id']

export const DEFAULT_DEV_THEME_PREVIEW = {
  ...DEV_THEME_PRESETS[0].palette,
} as const satisfies DevThemePreview

export const DEV_THEME_STORAGE_KEY = 'nextphrase:dev-theme-preview'

function isScalableColor(value: unknown): value is ColorScale {
  if (!value || typeof value !== 'object') return false

  const scale = value as Record<string, unknown>
  return (
    typeof scale['50'] === 'string' &&
    typeof scale['500'] === 'string' &&
    typeof scale['950'] === 'string'
  )
}

const scalableColorEntries = Object.entries(tailwindColors).filter(
  (entry): entry is [ScalableTailwindColorName, ColorScale] =>
    isScalableColor(entry[1]),
)

const scalableColors = Object.fromEntries(scalableColorEntries) as Record<
  ScalableTailwindColorName,
  ColorScale
>

export const scalableTailwindColorNames = scalableColorEntries.map(
  ([name]) => name,
)

export function isScalableTailwindColorName(
  value: unknown,
): value is ScalableTailwindColorName {
  return (
    typeof value === 'string' &&
    scalableTailwindColorNames.includes(value as ScalableTailwindColorName)
  )
}

export function getScalableTailwindColor(
  colorName: ScalableTailwindColorName,
  shade: ColorShade = 500,
) {
  return scalableColors[colorName][shade]
}

export function getDevThemePreset(themeId: unknown) {
  return DEV_THEME_PRESETS.find(theme => theme.id === themeId)
}

export function getMatchingDevThemePreset(preview: DevThemePreview) {
  return DEV_THEME_PRESETS.find(theme =>
    (Object.keys(preview) as (keyof DevThemePreview)[]).every(
      field => theme.palette[field] === preview[field],
    ),
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function readDevThemePreview(): DevThemePreview {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_DEV_THEME_PREVIEW }
  }

  try {
    const storedValue = window.localStorage.getItem(DEV_THEME_STORAGE_KEY)
    if (!storedValue) return { ...DEFAULT_DEV_THEME_PREVIEW }

    const parsedValue: unknown = JSON.parse(storedValue)
    if (!isRecord(parsedValue)) return { ...DEFAULT_DEV_THEME_PREVIEW }

    return {
      accent: isScalableTailwindColorName(parsedValue.accent)
        ? parsedValue.accent
        : DEFAULT_DEV_THEME_PREVIEW.accent,
      teamA: isScalableTailwindColorName(parsedValue.teamA)
        ? parsedValue.teamA
        : DEFAULT_DEV_THEME_PREVIEW.teamA,
      teamB: isScalableTailwindColorName(parsedValue.teamB)
        ? parsedValue.teamB
        : DEFAULT_DEV_THEME_PREVIEW.teamB,
      neutral: isScalableTailwindColorName(parsedValue.neutral)
        ? parsedValue.neutral
        : DEFAULT_DEV_THEME_PREVIEW.neutral,
    }
  } catch {
    return { ...DEFAULT_DEV_THEME_PREVIEW }
  }
}

function applyColorScale(
  tokenName: string,
  colorName: ScalableTailwindColorName,
) {
  const rootStyle = document.documentElement.style
  const colorScale = scalableColors[colorName]

  colorShades.forEach(shade => {
    rootStyle.setProperty(`--color-${tokenName}-${shade}`, colorScale[shade])
  })
}

export function applyDevThemePreview(preview: DevThemePreview) {
  applyColorScale('primaryColor', preview.accent)
  applyColorScale('teamAColor', preview.teamA)
  applyColorScale('teamBColor', preview.teamB)
  applyColorScale('neutralColor', preview.neutral)

  const rootStyle = document.documentElement.style
  const accentScale = scalableColors[preview.accent]
  const teamAScale = scalableColors[preview.teamA]
  const teamBScale = scalableColors[preview.teamB]
  const neutralScale = scalableColors[preview.neutral]
  const neutralColor = neutralScale[100]
  const accentSurface = getReadableColorSurface(accentScale, neutralColor)
  const teamASurface = getReadableColorSurface(teamAScale, neutralColor)
  const teamBSurface = getReadableColorSurface(teamBScale, neutralColor)
  const accentText = getReadablePaletteTextColor(accentScale)
  const teamAText = getReadablePaletteTextColor(teamAScale)
  const teamBText = getReadablePaletteTextColor(teamBScale)

  rootStyle.setProperty('--color-fadedTextColor', accentText.color)
  rootStyle.setProperty('--color-teamATextColor', teamAText.color)
  rootStyle.setProperty('--color-teamBTextColor', teamBText.color)
  rootStyle.setProperty('--color-textColor', neutralColor)
  rootStyle.setProperty(
    '--color-accentFillColor',
    accentSurface.backgroundColor,
  )
  rootStyle.setProperty('--color-teamAFillColor', teamASurface.backgroundColor)
  rootStyle.setProperty('--color-teamBFillColor', teamBSurface.backgroundColor)
  applyTextOnThemeColors({
    accentColor: accentSurface.backgroundColor,
    neutralColor,
    teamAColor: teamASurface.backgroundColor,
    teamBColor: teamBSurface.backgroundColor,
  })

  window.dispatchEvent(new Event(THEME_COLORS_CHANGED_EVENT))
}

export function persistDevThemePreview(preview: DevThemePreview) {
  try {
    localStorage.setItem(
      DEV_THEME_STORAGE_KEY,
      serializeDevThemePreview(preview),
    )
  } catch {
    // The live preview should still work when storage is unavailable.
  }
}

export function serializeDevThemePreview(preview: DevThemePreview) {
  return JSON.stringify({
    accent: preview.accent,
    teamA: preview.teamA,
    teamB: preview.teamB,
    neutral: preview.neutral,
  })
}
