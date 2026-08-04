export const appDisplayModeQueries = [
  '(display-mode: standalone)',
  '(display-mode: fullscreen)',
] as const

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean
}

function getDisplayModeMediaQueries() {
  return appDisplayModeQueries.map(query => window.matchMedia(query))
}

export function isAppRunningStandalone() {
  if (typeof window === 'undefined') return false

  const navigatorWithStandalone = window.navigator as NavigatorWithStandalone

  return (
    navigatorWithStandalone.standalone === true ||
    getDisplayModeMediaQueries().some(mediaQuery => mediaQuery.matches)
  )
}

export function subscribeToAppDisplayMode(onChange: () => void) {
  if (typeof window === 'undefined') return () => {}

  const mediaQueries = getDisplayModeMediaQueries()

  mediaQueries.forEach(mediaQuery => {
    mediaQuery.addEventListener('change', onChange)
  })

  return () => {
    mediaQueries.forEach(mediaQuery => {
      mediaQuery.removeEventListener('change', onChange)
    })
  }
}

export function getAppDisplayModeServerSnapshot() {
  return false
}
