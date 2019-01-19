import styled from 'styled-components';
import { dimensions } from '../config';
import Button from './Button';

const ToggleButton = styled(Button)`
  width: 100%;
  position: relative;
  margin-bottom: ${dimensions.borderWidth};
  justify-content: space-between;
  opacity: 0.5;
  &:after {
    content: '';
    position: absolute;
    right: 0;
    font-family: 'Font Awesome 5 Pro';
  }
  ${props =>
    props.isActive &&
    `
    opacity: 1;
    &:after {
      content: '';
    }
  `}
`;

export default ToggleButton;
