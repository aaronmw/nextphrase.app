import styled from 'styled-components';
import { dimensions } from '../config';
import Button from './Button';

const StartButton = styled(Button).attrs({
  tapSound: 'woosh'
})`
  top: calc(
    ${dimensions.headerHeight} + ${dimensions.pointButtonHeight} +
      calc(${dimensions.borderWidth} * 3) + env(safe-area-inset-top)
  );
  right: ${dimensions.borderWidth};
  bottom: calc(${dimensions.borderWidth} + env(safe-area-inset-bottom));
  left: ${dimensions.borderWidth};
  ${props => !props.isVisible && `transform: translateY(100%);`}
`;

export default StartButton;
