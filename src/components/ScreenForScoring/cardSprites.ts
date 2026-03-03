export const SPRITE_SCALE_FACTOR = 0.65

export const CARD_SPRITES: Record<string, string[]> = {
  '6': ['6-top-right', '6-bottom-left'],
  '5': [
    '5-top-right',
    '5-bottom-left',
    '5-top-left',
    '5-bottom-right',
  ],
  '4': [
    '5-top-right',
    '5-bottom-left',
    '4-top-left',
    '4-top-right',
    '4-left',
    '4-bottom-right',
  ],
  '3': [
    '5-top-right',
    '5-bottom-left',
    '4-top-left',
    '4-top-right',
    '4-bottom-left',
    '3-top-left',
    '3-top-right',
    '3-bottom-right',
  ],
  '2': [
    '5-top-right',
    '5-bottom-left',
    '4-top-left',
    '3-bottom-right',
    '3-top-right',
    '2-top-right',
    '2-top-left',
    '2-left',
    '2-bottom-left',
  ],
  '1': [
    '1-left',
    '1-top-left',
    '1-top-right',
    '1-bottom',
    '5-bottom-left',
  ],
}

function positionFromSpriteKey(key: string): string {
  const parts = key.split('-')
  if (parts.length < 2) return 'top-0 left-0'
  const position = parts.slice(1).join('-')
  switch (position) {
    case 'top-right':
      return 'top-0 right-0'
    case 'top-left':
      return 'top-0 left-0'
    case 'bottom-right':
      return 'bottom-0 right-0'
    case 'bottom-left':
      return 'bottom-0 left-0'
    case 'left':
      return 'left-0 top-1/2 -translate-y-1/2'
    case 'top':
      return 'top-0 left-1/2 -translate-x-1/2'
    case 'bottom':
      return 'bottom-0 left-1/2 -translate-x-1/2'
    default:
      return 'top-0 left-0'
  }
}

export function getSpritePositionClass(key: string): string {
  return positionFromSpriteKey(key)
}

function positionNameFromSpriteKey(key: string): string {
  const parts = key.split('-')
  if (parts.length < 2) return 'top-left'
  return parts.slice(1).join('-')
}

export function getSpriteOriginClass(key: string): string {
  const position = positionNameFromSpriteKey(key)
  switch (position) {
    case 'top-right':
      return 'origin-top-right'
    case 'top-left':
      return 'origin-top-left'
    case 'bottom-right':
      return 'origin-bottom-right'
    case 'bottom-left':
      return 'origin-bottom-left'
    case 'left':
      return 'origin-left'
    case 'top':
      return 'origin-top'
    case 'bottom':
      return 'origin-bottom'
    default:
      return 'origin-top-left'
  }
}
