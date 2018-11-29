import React, { Component } from 'react';
import styled from 'styled-components';
import { LONG_PRESS_DURATION } from '../config';

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
  constructor() {
    super();

    this.state = {
      touchStartedAt: null
    };
  }

  handleTouchStart = () => {
    this.setState({
      touchStartedAt: Date.now()
    });
  }

  handleTouchEnd = () => {
    const touchDuration = Date.now() - this.state.touchStartedAt;
    if (touchDuration < LONG_PRESS_DURATION) {
      console.log('TAP');
    } else {
      console.log('LONG PRESS');
    }

    this.setState({
      touchStartedAt: null
    });
  }

  render() {
    const { children, className } = this.props;
    return (
      <ButtonSurface
        className={className}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
      >
        {children}
      </ButtonSurface>
    );
  }
}

export default styled(Button)``;
