// Temporary recording switch. Set to false to restore normal development behavior.
const SCREENCAP_MODE_ENABLED = true

// Recording conveniences must never reset a production player's saved game.
export const screencapMode =
  SCREENCAP_MODE_ENABLED && process.env.NODE_ENV === 'development'
