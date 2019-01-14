import styled from 'styled-components';
import GameSurface from './GameSurface';

const HeaderSection = styled(GameSurface)`
  position: relative;
  background: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition-timing-function: ease-out;
`;

export default HeaderSection;
