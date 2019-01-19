import styled from 'styled-components';
import { dimensions } from '../config';
import GameSurface from './GameSurface';

const Header = styled(GameSurface)`
  top: calc(${dimensions.borderWidth} + env(safe-area-inset-top));
  left: ${dimensions.borderWidth};
  right: ${dimensions.borderWidth};
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: ${dimensions.headerHeight};
`;

export default Header;
