import React, { PropTypes, Component } from "react";
import styled, { keyframes } from "styled-components";

const Container = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  width: 100%;
  height: 66.666%;
`;

const newPhrase = keyframes`
  from {
    opacity: 0;
    filter: blur(20px);
    transform: scale(5) translateY(20%);
  }
  to {
    opacity: 1;
    filter: blur(0);
    transform: scale(1) translateY(0);
  }
`;

const PhraseCanvas = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  padding: 20px;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1.1;
  background: ${ props => props.theme.secondary };
  color: ${ props => props.theme.primary };
  animation: ${newPhrase} 0.125s linear;
`;

class PhraseSwitcher extends Component {
  static propTypes = {
    phrase: PropTypes.string.isRequired,
  };

  state = { lastPhrase: "" };

  componentWillReceiveProps (nextProps) {
    if (nextProps.phrase !== this.props.phrase) {
      this.setState({ lastPhrase: this.props.phrase });
    }
  }

  render () {
    const { phrase } = this.props;
    const { lastPhrase } = this.state;

    return (
      <Container>
        <PhraseCanvas key="last-phrase">{ lastPhrase }</PhraseCanvas>
        <PhraseCanvas key={phrase}>{ phrase }</PhraseCanvas>
      </Container>
    );
  }
}

export default PhraseSwitcher;
