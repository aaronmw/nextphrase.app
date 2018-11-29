import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  width: 100vw;
  height: 100vh;
  grid-template-columns: ${props => props.columns};
  grid-template-rows: ${props => props.rows};
  grid-template-areas: ${props => props.areas};
`;

const GridLayout = ({ className, children, ...others }) => (
  <Container className={className} {...others}>{children}</Container>
);
export default GridLayout;

const GridArea = styled.div`
  border: 2px solid white;
  color: white;
  grid-area: ${props => props.snapTo};
`;
export { GridArea };
