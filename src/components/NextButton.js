import styled from 'styled-components';
import { DESIGN_TOKENS } from '../config';
import Button from './Button';

const NextButton = styled(Button).attrs({
  tapSound: 'woosh'
})`
  bottom: ${DESIGN_TOKENS.dimensions.gutterSize};
  left: ${DESIGN_TOKENS.dimensions.gutterSize};
  right: ${DESIGN_TOKENS.dimensions.gutterSize};
  height: 50vw;
  ${props => !props.isVisible && `transform: translateY(100%);`}
`;

export default NextButton;
