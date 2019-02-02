import React, { Component } from 'react';
import styled from 'styled-components';

function withFreezability(WrappedComponent) {
  const Freezable = styled(WrappedComponent)`
    ${props => props.isFrozen && `opacity: 0.5; pointer-events: none;`}
  `;

  return class extends Component {
    render() {
      const { isFrozen, children, ...rest} = this.props;

      return (
        <Freezable isFrozen={isFrozen} {...rest}>
          {children}
        </Freezable>
      );
    }
  };
}

export default withFreezability;
