import styled from 'styled-components';
import { dimensions, colors } from '../config';
import GameSurface from './GameSurface';

const PhraseCanvas = styled(GameSurface)`
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
  padding: 0 10vw;
  text-align: center;
  background: transparent;
  color: ${colors.background};

  ${props =>
    !props.isVisible && `transform: translateX(0) translateY(0) scale(0);`}
`;

export default PhraseCanvas;
