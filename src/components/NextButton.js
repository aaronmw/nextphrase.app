import styled from 'styled-components';
import { dimensions } from '../config';
import Button from './Button';

const NextButton = styled(Button).attrs({
  tapSound: 'woosh'
})`
  bottom: calc(${dimensions.borderWidth} + env(safe-area-inset-bottom));
  left: ${dimensions.borderWidth};
  right: ${dimensions.borderWidth};
  height: calc(${dimensions.pointButtonHeight});
  ${props => !props.isVisible && `transform: translateY(110%);`}
  ${props => props.isFrozen && `opacity: 0.5; pointer-events: none;`}
`;

export default NextButton;
