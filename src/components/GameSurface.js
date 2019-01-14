import styled from 'styled-components';
import { DESIGN_TOKENS } from '../config';

const GameSurface = styled.div`
  position: absolute;
  background: ${DESIGN_TOKENS.colors.background};
  color: ${DESIGN_TOKENS.colors.foreground};
  transition-duration: ${DESIGN_TOKENS.timings.duration / 1000}s;
  opacity: 1;
  transition-property: transform, opacity;

  ${props =>
    props.isVisible !== false
      ? `
    transition-timing-function: ${DESIGN_TOKENS.timings.transitionOnEnter};
    pointer-events: all;
    transform: translateX(0) translateY(0) scale(1);
    transform-origin: center;
  `
      : `
    transition-timing-function: ${DESIGN_TOKENS.timings.transitionOnExit};
    pointer-events: none;
    opacity: 0;
  `}
`;

export default GameSurface;
