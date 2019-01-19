import React, { Component } from 'react';
import * as config from '../config';
import { playSound } from '../utils/sounds';
import StyledButton from './StyledButton';

class Button extends Component {
  handleTouchStart = e => {
    this.startedTouchAt = Date.now();
    this.longPressTimer = setTimeout(() => {
      if (this.props.onLongPress) {
        this.props.onLongPress();
        playSound(this.props.longPressSound || 'typewriter');
      }
    }, config.LONG_PRESS_DURATION);
  };

  handleTouchEnd = e => {
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
