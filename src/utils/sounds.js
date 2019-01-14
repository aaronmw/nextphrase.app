import webAudioToolkit from '../utils/webAudioToolkit';

const SOUNDS = [
  { name: 'a', path: '/sounds/a.wav' },
  { name: 'b', path: '/sounds/b.wav' },
  { name: 'tick', path: '/sounds/tick.wav' },
  { name: 'typewriter', path: '/sounds/typewriter.wav' },
  { name: 'beep', path: '/sounds/beep.wav' },
  { name: 'celebration', path: '/sounds/celebration.wav' },
  { name: 'woosh', path: '/sounds/woosh.wav' },
  { name: 'oops', path: '/sounds/oops.wav' }
];

const SOUND_BUFFERS = {};

SOUNDS.forEach(({ name, path }) => {
  webAudioToolkit.loadSound(process.env.PUBLIC_URL + path, buffer => {
    SOUND_BUFFERS[name] = buffer;
  });
});

export const playSound = name => {
  webAudioToolkit.playSound(SOUND_BUFFERS[name]);
};
