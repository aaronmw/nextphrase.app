import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';

const PulsingAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const PulseElement = styled.div`
  animation: ${PulsingAnimation} 0.25s ease-in-out;
`;

class Pulse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastTickTime: Date.now()
    };

    if (props.tick !== false) {
      setInterval(this.tick, 1000);
    }
  }

  tick = () => {
    this.setState({
      lastTickTime: Date.now()
    });
  };

  render() {
    const { children, ...rest } = this.props;

    return (
      <PulseElement {...rest} key={this.state.lastTickTime}>
        {children}
      </PulseElement>
    );
  }
}

export default Pulse;
