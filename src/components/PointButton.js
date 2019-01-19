import styled from 'styled-components';
import { dimensions } from '../config';
import Button from './Button';

const PointButton = styled(Button).attrs({
  longPressSound: 'oops'
})`
  top: calc(
    ${dimensions.headerHeight} + (${dimensions.borderWidth} * 2) +
      env(safe-area-inset-top)
  );
  width: calc(50vw - (${dimensions.borderWidth} * 1.5));
  height: calc(${dimensions.pointButtonHeight});
`;

export default PointButton;
