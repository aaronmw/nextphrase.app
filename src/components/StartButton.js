import styled from 'styled-components';
import { DESIGN_TOKENS } from '../config';
import Button from './Button';

const StartButton = styled(Button).attrs({
  tapSound: 'woosh'
})`
  outline: 1px solid red;
  bottom: ${DESIGN_TOKENS.dimensions.gutterSize};
  left: ${DESIGN_TOKENS.dimensions.gutterSize};
  right: ${DESIGN_TOKENS.dimensions.gutterSize};
  top: calc(
    ${DESIGN_TOKENS.dimensions.gutterSize} + ${DESIGN_TOKENS.dimensions.headerHeight} +
      ${DESIGN_TOKENS.dimensions.secondaryButtonHeight} +
      ${DESIGN_TOKENS.dimensions.gutterSize}
  );
  ${props => !props.isVisible && `transform: translateY(110%);`}
`;

export default StartButton;
