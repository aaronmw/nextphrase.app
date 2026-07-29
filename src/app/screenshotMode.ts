export const isScreenshotMode =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_SCREENSHOT_MODE === 'true'
