import styled from 'styled-components';
import { DESIGN_TOKENS } from '../config';
import GameSurface from './GameSurface';

const Settings = styled(GameSurface)`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  padding: 5vw;
  bottom: ${DESIGN_TOKENS.dimensions.gutterSize};
  left: ${DESIGN_TOKENS.dimensions.gutterSize};
  right: ${DESIGN_TOKENS.dimensions.gutterSize};
  top: calc(25vw + ${DESIGN_TOKENS.dimensions.gutterSize} * 2);
  ${props => !props.isVisible && `transform: translateY(110%);`}
`;

export default Settings;
