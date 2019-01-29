import styled from 'styled-components';
import { colors } from '../config';
import Button from './Button';

const ToggleButton = styled(Button)`
  width: 100%;
  position: relative;
  justify-content: space-between;

  &:after {
    content: '';
    color: ${colors.faded};
    position: absolute;
    right: 0;
    font-family: 'Font Awesome 5 Pro';
  }
  ${props =>
    props.isActive &&
    `
    &:after {
      content: '';
      color: ${colors.foreground};
    }
  `}
`;

export default ToggleButton;
