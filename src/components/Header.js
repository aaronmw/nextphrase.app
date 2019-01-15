import styled from 'styled-components';
import { DESIGN_TOKENS } from '../config';
import GameSurface from './GameSurface';

const Header = styled(GameSurface)`
  top: ${DESIGN_TOKENS.dimensions.gutterSize};
  left: ${DESIGN_TOKENS.dimensions.gutterSize};
  right: ${DESIGN_TOKENS.dimensions.gutterSize};
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 25vw;
`;

export default Header;
