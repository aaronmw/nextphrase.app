import React, { Component } from 'react';
import * as config from '../config';
import { colors } from '../config';
import styled from 'styled-components';
import GameSurface from './GameSurface';
import { playSound } from '../utils/sounds';

const StyledButton = styled(GameSurface)`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  &:active {
    color: ${colors.faded};
  }
`;

class Button extends Component {
  handleTouchStart = () => {
    this.startedTouchAt = Date.now();
    this.longPressTimer = setTimeout(() => {
      if (this.props.onLongPress) {
        this.props.onLongPress();
        playSound(this.props.longPressSound || 'typewriter');
      }
    }, config.LONG_PRESS_DURATION);
  };

  handleTouchEnd = () => {
    const timePressed = Date.now() - this.startedTouchAt;
    if (timePressed < config.LONG_PRESS_DURATION) {
      this.longPressTimer = clearTimeout(this.longPressTimer);
      this.props.onTap();
      playSound(this.props.tapSound || 'typewriter');
    }
  };

  render() {
    const { children, onTap, onLongPress, ...rest } = this.props;

    return (
      <StyledButton
        {...rest}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
      >
        {children}
      </StyledButton>
    );
  }
}

export default Button;
