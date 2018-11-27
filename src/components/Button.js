import React, { Component } from 'react';
import styled from 'styled-components';

const ButtonSurface = styled.button`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  border: 2px solid white;
  color: white;
  font-size: 2rem;
  font-weight: bold;
`;

class Button extends Component {
  render() {
    return (
      <ButtonSurface className={this.props.className}>{this.props.children}</ButtonSurface>
    );
  }
}

export default styled(Button)``;
