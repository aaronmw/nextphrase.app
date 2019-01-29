import styled from 'styled-components';
import { colors, dimensions } from '../config';
import GameSurface from './GameSurface';
import { RushBackground } from './RushAnimation';

const Header = styled(GameSurface)`
  top: calc(${dimensions.borderWidth} + env(safe-area-inset-top));
  left: ${dimensions.borderWidth};
  right: ${dimensions.borderWidth};
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: ${dimensions.headerHeight};
  background-color: ${colors.background};
  ${props => props.isRushing && RushBackground}
  ${props => props.isFrozen && `opacity: 0.5; pointer-events: none;`}
`;

export default Header;
