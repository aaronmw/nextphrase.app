import React, { PropTypes, Component } from 'react';
import styled, { keyframes } from 'styled-components';

const fallIn = keyframes`
  from {
    opacity: 0;
    filter: blur(10px);
    transform: scale(4) translateY(20%);
  }
  to {
    opacity: 1;
    filter: blur(0);
    transform: scale(1) translateY(0);
  }
`;

const flipInX = keyframes`
  from {
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    animation-timing-function: ease-in;
    opacity: 0;
  }

  40% {
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    animation-timing-function: ease-in;
  }

  60% {
    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
    opacity: 1;
  }

  80% {
    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
  }

  to {
    transform: perspective(400px);
  }
`;

const Container = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  top: 0;
  width: 100%;
  height: 66.666%;
  line-height: 1.1;
  text-align: center;
  color: ${props => props.theme.primary};
  background: ${props => props.theme.secondary};
`;

const Phrase = styled.div`
  position: relative;
  padding: 4rem;
  z-index: 1;
  backface-visibility: visible !important;
  animation: ${flipInX} 0.625s ease-in-out;
`;

class PhraseSwitcher extends Component {
  static propTypes = {
    phrase: PropTypes.string.isRequired
  };

  state = { previousPhrase: '' };

  componentWillReceiveProps(incomingProps) {
    // If the phrase changes...
    if (incomingProps.phrase !== this.props.phrase) {
      // Keep a very brief history, for animation
      this.setState({ previousPhrase: this.props.phrase });
    }
  }

  render() {
    const { phrase } = this.props;
    const { previousPhrase } = this.state;

    return (
      <Container>
        {/* <Phrase key={`unique ${phrase}`}>{previousPhrase}</Phrase> */}
        <Phrase key={phrase}>{phrase}</Phrase>
      </Container>
    );
  }
}

export default PhraseSwitcher;
