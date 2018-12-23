import React, { Component } from 'react';
import styled from 'styled-components';
import { LONG_PRESS_DURATION, DESIGN_TOKENS } from '../config';

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

const StyledGridArea = styled.div`
  border: 2px solid white;
  color: white;
  grid-area: ${props => props.snapTo};
  display: flex;
  justify-content: center;
  align-items: center;

  &:active {
    background-color: ${DESIGN_TOKENS.colors.highlight};
  }
`;

let tapTimer = null;

class GridArea extends Component {
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
    tapTimer = setTimeout(this.props.longPressHandler, LONG_PRESS_DURATION);
  }

  handleTouchEnd = () => {
    const touchDuration = Date.now() - this.state.touchStartedAt;
    if (touchDuration < LONG_PRESS_DURATION) {
      this.props.tapHandler();
      tapTimer = clearTimeout(tapTimer);
      console.log('TAP');
    } else {
      console.log('LONG PRESS');
    }

    this.setState({
      touchStartedAt: null
    });
  }

  render() {
    const { children, className, ...rest } = this.props;
    return (
      <StyledGridArea
        {...rest}
        className={className}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
      >
        {children}
      </StyledGridArea>
    );
  }
}


export { GridArea };
