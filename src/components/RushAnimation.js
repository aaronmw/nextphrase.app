import { css, keyframes } from 'styled-components';
import { tint } from 'polished';
import { colors } from '../config';

const fireColorOne = colors.background;
const fireColorTwo = tint(0.2, fireColorOne);

const RushBackgroundKeyframes = keyframes`
  from {
    background-color: ${fireColorOne};
  }
  to {
    background-color: ${fireColorTwo};
  }
`;

export const RushBackground = css`
  animation: ${RushBackgroundKeyframes} 0.25s linear infinite alternate;
`;


const RushForegroundKeyframes = keyframes`
  from {
    color: ${fireColorOne};
  }
  to {
    color: ${fireColorTwo};
  }
`;

export const RushForeground = css`
  animation: ${RushForegroundKeyframes} 0.25s linear infinite alternate;
`;
