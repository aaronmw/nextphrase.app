import React, { Component } from 'react';
import styled from 'styled-components';
import { LONG_PRESS_DURATION, DESIGN_TOKENS } from '../config';
import { GridArea } from './GridLayout';

const ButtonSurface = styled(GridArea)`
  ${props => props.inflated ? `
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
  ` : ''}

  &:active {
    background-color: ${DESIGN_TOKENS.colors.highlight};
  }
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
    const { children, className, inflated, ...others } = this.props;
    return (
      <ButtonSurface
        className={className}
        inflated={inflated}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        {...others}
      >
        {children}
      </ButtonSurface>
    );
  }
}

export default styled(Button)``;
