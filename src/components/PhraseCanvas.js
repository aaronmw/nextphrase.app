import styled from 'styled-components';
import { DESIGN_TOKENS } from '../config';
import GameSurface from './GameSurface';

const PhraseCanvas = styled(GameSurface)`
  background: transparent;
  color: ${DESIGN_TOKENS.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  left: ${DESIGN_TOKENS.dimensions.gutterSize};
  right: ${DESIGN_TOKENS.dimensions.gutterSize};
  bottom: calc(50vw + ${DESIGN_TOKENS.dimensions.gutterSize});
  height: calc(
    100vh - (50vw - (${DESIGN_TOKENS.dimensions.gutterSize} * 1.5)) - (25vw) -
      (${DESIGN_TOKENS.dimensions.gutterSize} * 4)
  );

  ${props =>
    !props.isVisible && `transform: translateX(0) translateY(0) scale(0);`}
`;

export default PhraseCanvas;
