import { shade } from 'polished';

export const DEBUG_MODE = false;

const DEBUG_ROUND_TIME = 3;
const DEBUG_RUSH_DURATION = DEBUG_ROUND_TIME - 1;
const DEBUG_NEXT_BUTTON_FREEZE_TIME = 1;
export const MIN_ROUND_TIME = (DEBUG_MODE ? DEBUG_ROUND_TIME : 45) * 1000;
export const MAX_ROUND_TIME = (DEBUG_MODE ? DEBUG_ROUND_TIME : 60) * 1000;
export const MIN_RUSH_DURATION = (DEBUG_MODE ? DEBUG_RUSH_DURATION : 5) * 1000;
export const MAX_RUSH_DURATION = (DEBUG_MODE ? DEBUG_RUSH_DURATION : 10) * 1000;
export const NEXT_BUTTON_FREEZE_TIME =
  (DEBUG_MODE ? DEBUG_NEXT_BUTTON_FREEZE_TIME : 2) * 1000;

export const MAX_SCORE = 7;
export const DEFAULT_TICK_RATE = 500;
export const FAST_TICK_RATE = 250;
export const LONG_PRESS_DURATION = 0.375 * 1000;

export const DEFAULT_LISTS = {
  Entertainment: true,
  'Everyday Life': true,
  'Fun & Games': true,
  NSFW: false,
  'Star Wars': false,
  'The World': true
};

export const timings = {
  duration: 175,
  // transitionOnEnter: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  // transitionOnExit: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)'
  transitionOnEnter: 'ease-in-out',
  transitionOnExit: 'ease-in-out'
};

const backgroundColor = '#00b2a9';

export const colors = {
  teamA: '#004ea9',
  teamB: 'tomato',
  background: backgroundColor,
  backgroundDark: shade(0.3, backgroundColor),
  foreground: '#fff',
  faded: '#8FFFF9'
};

const borderWidth = '6px';

export const dimensions = {
  borderWidth: borderWidth,
  headerHeight: '20vw',
  pointButtonHeight: `(50vw - (${borderWidth} * 1.5))`
};
