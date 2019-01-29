import styled from 'styled-components';
import { dimensions } from '../config';
import GameSurface from './GameSurface';

const Settings = styled(GameSurface)`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  bottom: calc((${dimensions.borderWidth} * 2) + env(safe-area-inset-bottom) + ${dimensions.pointButtonHeight});
  left: ${dimensions.borderWidth};
  right: ${dimensions.borderWidth};
  top: calc(${dimensions.headerHeight} + (${dimensions.borderWidth} * 2) + env(safe-area-inset-top));

  ${props => !props.isVisible && `transform: translateY(110%);`}
`;

export default Settings;
