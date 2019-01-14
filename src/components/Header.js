import styled from 'styled-components';
import { DESIGN_TOKENS } from '../config';
import GameSurface from './GameSurface';

const Header = styled(GameSurface)`
  top: ${DESIGN_TOKENS.borders.width};
  left: ${DESIGN_TOKENS.borders.width};
  right: ${DESIGN_TOKENS.borders.width};
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 25vw;
`;

export default Header;
