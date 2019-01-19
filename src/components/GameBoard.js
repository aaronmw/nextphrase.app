import styled from 'styled-components';
import { timings } from '../config';

const GameBoard = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  transition: transform ${timings.duration / 1000}s ease-in-out;
  ${props => props.isRotated && `
    transform: rotate(180deg);
    top: calc(env(safe-area-inset-top) - env(safe-area-inset-bottom));
  `}
`;

export default GameBoard;
