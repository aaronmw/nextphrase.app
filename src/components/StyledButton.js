import styled from 'styled-components';
import GameSurface from './GameSurface';

const StyledButton = styled(GameSurface)`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  &:active {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export default StyledButton;
