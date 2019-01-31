import React, { Component } from 'react';
import { colors } from '../config';

const SCROLL_SHADOW_SIZE = 40;

function withScrollShadow(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        bottomScrollShadowSize: 0,
        topScrollShadowSize: 0,
        distanceScrolled: 0
      };

      this.commonStyles = {
        position: 'absolute',
        zIndex: 100000,
        right: 0,
        left: 0
      };

      this.ref = React.createRef();

      setTimeout(() => {
        this.onScroll({
          target: this.ref.current
        });
      }, 1);
    }

    onScroll = event => {
      const el = event.target;

      const distanceScrolled = el.scrollTop;
      const scrollPotential = el.scrollHeight - el.offsetHeight;
      const scrollRemaining = scrollPotential - distanceScrolled;

      const bottomScrollShadowSize = Math.min(
        SCROLL_SHADOW_SIZE,
        scrollRemaining
      );

      const topScrollShadowSize = Math.min(
        SCROLL_SHADOW_SIZE,
        distanceScrolled
      );

      this.setState({
        distanceScrolled,
        bottomScrollShadowSize,
        topScrollShadowSize
      });
    };

    render() {
      const { children, ...rest } = this.props;

      const {
        bottomScrollShadowSize,
        distanceScrolled,
        topScrollShadowSize
      } = this.state;

      return (
        <WrappedComponent {...rest} onScroll={this.onScroll} ref={this.ref}>
          {children}

          <div
            style={{
              ...this.commonStyles,
              top: distanceScrolled + 'px',
              height: topScrollShadowSize + 'px',
              background:
                `radial-gradient(farthest-side at 50% 0%, ${colors.backgroundDark} 0%, rgba(0, 0, 0, 0) 100%)`
            }}
          />

          <div
            style={{
              ...this.commonStyles,
              bottom: distanceScrolled * -1 + 'px',
              height: bottomScrollShadowSize + 'px',
              background:
                `radial-gradient(farthest-side at 50% 100%, ${colors.backgroundDark} 0%, rgba(0, 0, 0, 0) 100%)`
            }}
          />
        </WrappedComponent>
      );
    }
  };
}

export default withScrollShadow;
