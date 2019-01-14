import styled, { keyframes } from 'styled-components';

const PulsingAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const Pulse = styled.div`
  animation: ${PulsingAnimation} 0.25s linear;
`;

export default Pulse;
