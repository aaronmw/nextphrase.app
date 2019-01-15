import styled from 'styled-components';
import { DESIGN_TOKENS } from '../config';
import Button from './Button';

const PointButton = styled(Button).attrs({
  longPressSound: 'oops'
})`
  top: calc(25vw + (${DESIGN_TOKENS.dimensions.gutterSize} * 2));
  width: calc(50vw - (${DESIGN_TOKENS.dimensions.gutterSize} * 1.5));
  height: calc(50vw - (${DESIGN_TOKENS.dimensions.gutterSize} * 1.5));
`;

export default PointButton;
