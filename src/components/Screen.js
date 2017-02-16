import React, { PropTypes } from "react";
import styled from "styled-components";

const Container = styled.div`
  background-color: ${props => props.theme.secondary};
  font-family: 'Helvetica Neue';
  font-weight: bold;
  text-transform: uppercase;
  color: ${props => props.theme.primary};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 0;
  flex-shrink: 0;
  height: 50px;
  background-color: ${props => props.theme.primary};
  border-bottom: 1px solid ${props => props.theme.secondary};
  border: 1px solid ${props => props.theme.secondary};
  color: ${props => props.theme.secondary};
  padding: 0 15px;
`;

const Body = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const Screen = ({ header, body }) => (
  <Container>
    <Header>
      {header}
    </Header>
    <Body>
      {body}
    </Body>
  </Container>
);

Screen.propTypes = {
  header: PropTypes.element.isRequired,
  body: PropTypes.element.isRequired,
};

export default Screen;
