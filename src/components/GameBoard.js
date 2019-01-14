import styled from 'styled-components';
import { DESIGN_TOKENS } from '../config';

const GameBoard = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  transition: transform ${DESIGN_TOKENS.timings.duration / 1000}s ease-in-out;
  ${props => props.isRotated && `
    transform: rotate(180deg);
  `}
`;

export default GameBoard;
