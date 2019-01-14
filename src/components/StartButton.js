import styled from 'styled-components';
import { DESIGN_TOKENS } from '../config';
import Button from './Button';

const StartButton = styled(Button).attrs({
  tapSound: 'woosh'
})`
  bottom: ${DESIGN_TOKENS.borders.width};
  left: ${DESIGN_TOKENS.borders.width};
  right: ${DESIGN_TOKENS.borders.width};
  height: calc(
    100vh - (50vw - (${DESIGN_TOKENS.borders.width} * 1.5)) - (25vw) -
      (${DESIGN_TOKENS.borders.width} * 4)
  );
  ${props => !props.isVisible && `transform: translateY(100%);`}
`;

export default StartButton;
