import { colors } from '../config';
import styled from 'styled-components';
import Button from './Button';

const SettingsButton = styled(Button)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  &:active {
    color: ${colors.faded};
  }
`;

export default SettingsButton;
