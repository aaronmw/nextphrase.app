import styled from 'styled-components';
import { colors, timings } from '../config';

const GameSurface = styled.div`
  position: absolute;
  background: ${colors.background};
  color: ${colors.foreground};
  transition-duration: ${timings.duration / 1000}s;
  opacity: 1;
  transition-property: transform, opacity;

  ${props =>
    props.isVisible !== false
      ? `
    transition-timing-function: ${timings.transitionOnEnter};
    pointer-events: all;
    transform: translateX(0) translateY(0) scale(1);
    transform-origin: center;
  `
      : `
    transition-timing-function: ${timings.transitionOnExit};
    pointer-events: none;
    opacity: 0;
  `}
`;

export default GameSurface;
