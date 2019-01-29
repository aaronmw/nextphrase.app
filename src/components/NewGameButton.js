import styled from 'styled-components';
import { dimensions } from '../config';
import Button from './Button';

const NewGameButton = styled(Button)`
  bottom: calc(${dimensions.borderWidth} + env(safe-area-inset-bottom));
  left: ${dimensions.borderWidth};
  right: ${dimensions.borderWidth};
  height: calc(${dimensions.pointButtonHeight});
  ${props => !props.isVisible && `transform: translateY(110%);`}
`;

export default NewGameButton;
