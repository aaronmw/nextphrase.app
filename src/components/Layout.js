import React, { Component } from 'react';
import styled from 'styled-components';
import Button from './Button';

const Container = styled.div`
  display: grid;
  width: 100vw;
  height: 100vh;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 10vh 50vw auto;
  grid-template-areas:
    "header      header"
    "leftbutton  rightbutton"
    "startbutton startbutton";
`;

const Header = styled(Button)`
  grid-area: header;
`;

const TeamAButton = styled(Button)`
  grid-area: leftbutton;
`;

const TeamBButton = styled(Button)`
  grid-area: rightbutton;
`;

const StartButton = styled(Button)`
  grid-area: startbutton;
`;

class Layout extends Component {
  render() {
    return (
      <Container>
        <Header>
          Header
        </Header>
        <TeamAButton>
          A
        </TeamAButton>
        <TeamBButton>
          B
        </TeamBButton>
        <StartButton>
          Start
        </StartButton>
      </Container>
    );
  }
};

export default Layout;
