import styled from 'styled-components';
import { dimensions } from '../config';
import GameSurface from './GameSurface';

const Settings = styled(GameSurface)`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  padding: 5vw;
  bottom: calc(${dimensions.borderWidth} + env(safe-area-inset-bottom));
  left: ${dimensions.borderWidth};
  right: ${dimensions.borderWidth};
  top: calc(
    ${dimensions.headerHeight} + (${dimensions.borderWidth} * 2) +
      env(safe-area-inset-top)
  );
  overflow: auto;
  ${props => !props.isVisible && `transform: translateY(110%);`}
`;

export default Settings;
