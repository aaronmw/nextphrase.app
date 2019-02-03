import React from 'react';
import styled from 'styled-components';
import { dimensions } from '../config';
import GameSurface from './GameSurface';
import Logo from './Logo';
import Arrow from './Arrow';

const Surface = styled(GameSurface)`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  padding: 5vw;
  text-align: center;
  top: ${dimensions.borderWidth};
  right: ${dimensions.borderWidth};
  height: calc(${window.innerHeight}px - (${dimensions.borderWidth} * 2));
  left: ${dimensions.borderWidth};
  ${props => !props.isVisible && `transform: scale(0);`}
`;

const AddToHomeScreen = props => {
  return (
    <Surface isVisible={props.isVisible}>
      <Logo />
      <p>
        Add to home screen
      </p>
      <Arrow />
    </Surface>
  );
};

export default AddToHomeScreen;
