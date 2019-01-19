import styled from 'styled-components';
import { dimensions, colors } from '../config';
import GameSurface from './GameSurface';

const PhraseCanvas = styled(GameSurface)`
  background: transparent;
  color: ${colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  left: ${dimensions.borderWidth};
  right: ${dimensions.borderWidth};
  bottom: calc(50vw + ${dimensions.borderWidth});
  height: calc(
    100vh - (50vw - (${dimensions.borderWidth} * 1.5)) - (25vw) -
      (${dimensions.borderWidth} * 4)
  );

  ${props =>
    !props.isVisible && `transform: translateX(0) translateY(0) scale(0);`}
`;

export default PhraseCanvas;
