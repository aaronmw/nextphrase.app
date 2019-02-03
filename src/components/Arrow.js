import React from 'react';
import { colors } from '../config';
import styled, { keyframes } from 'styled-components';

const bouncingAnimation = keyframes`
  0% {
    transform: translateY(-0.5rem);
  }
  100% {
    transform: translateY(0.5rem);
  }
`;

const Bounce = styled.div`
  animation: ${bouncingAnimation} 0.300s ease-in-out infinite alternate-reverse;
`;

const Arrow = () => {
  return (
    <Bounce>
      <svg
        width="106"
        height="188"
        viewBox="0 0 106 188"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          height: '20vh'
        }}
      >
        <path
          d="M81.3736 141.855H105.779L57.5636 187.576L10 141.855H33.9447L33.9447 20.3913L81.3736 10L81.3736 141.855Z"
          fill={colors.teamA}
        />
        <path
          d="M71.3736 131.855H95.7788L47.5636 177.576L1.52588e-05 131.855H23.9447L23.9447 10.3913L71.3736 0L71.3736 131.855Z"
          fill={colors.teamB}
        />
      </svg>
    </Bounce>
  );
};

export default Arrow;
