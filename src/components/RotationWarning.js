import React from 'react';
import styled from 'styled-components';

const StyledWarning = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 0, 0, 0.95);
  z-index: 100;
  font-family: 'Font Awesome 5 Pro';
  font-size: 4rem;
`;

const RotationWarning = ({ orientation }) => {
  if (['left', 'right'].indexOf(orientation) !== -1) {
    return <StyledWarning>&#xf021;</StyledWarning>;
  }

  return null;
};

export default RotationWarning;
