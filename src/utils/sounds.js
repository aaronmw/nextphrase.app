import webAudioToolkit from "../utils/webAudioToolkit";

const SOUNDS = [
  { name: 'timerTick', path: '/sounds/tick.wav'},
  { name: 'addPoint', path: '/sounds/typewriter.wav'},
  { name: 'endRound', path: '/sounds/beep.wav'},
  { name: 'winRound', path: '/sounds/celebration.wav'},
  { name: 'nextPhrase', path: '/sounds/woosh.wav'}
];

const SOUND_BUFFERS = {};

SOUNDS.forEach(({ name, path }) => {
  webAudioToolkit.loadSound(path, buffer => { SOUND_BUFFERS[name] = buffer });
});

export const playSound = name => {
  webAudioToolkit.playSound(SOUND_BUFFERS[name]);
};
