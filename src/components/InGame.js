import React, { Component, PropTypes } from 'react';
import { NEXT_BUTTON_FREEZE_TIME } from '../config';
import PhraseSwitcher from './PhraseSwitcher';
import styled from 'styled-components';
import { GameBoard, GameHeader, GameButton, GameContent } from './GameElements';

const NextButton = styled(GameButton)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 33.333%;
  z-index: 1000;
  transition: color 0.2s ease-in-out;

  ${props =>
    props.isSkipDisabled
      ? `
    color: rgba(255,255,255,0.2);

    &:active {
      background: none;
    }
  `
      : ''};
`;

class InGame extends Component {
  state = { isSkipDisabled: true };

  freezeNextButton() {
    this.setState({ isSkipDisabled: true });

    this.unfreezeTimer = setTimeout(() => {
      this.setState({ isSkipDisabled: false });
    }, NEXT_BUTTON_FREEZE_TIME);
  }

  componentDidMount() {
    this.freezeNextButton();
  }

  componentWillUnmount() {
    clearTimeout(this.unfreezeTimer);
  }

  handleTouchNext = () => {
    if (this.state.isSkipDisabled) {
      return;
    } else {
      this.props.onTouchNext();
      this.freezeNextButton();
    }
  };

  render() {
    const {
      pointsForTeamA,
      pointsForTeamB,
      onTouchStop,
      phrase,
      isRotated,
      isRushing
    } = this.props;
    const { isSkipDisabled } = this.state;

    return (
      <GameBoard isRotated={isRotated} isRushing={isRushing}>
        <GameHeader
          buttonIcon="pause"
          onTouchButton={onTouchStop}
          pointsForTeamA={pointsForTeamA}
          pointsForTeamB={pointsForTeamB}
        />
        <GameContent>
          <PhraseSwitcher phrase={phrase} />
          <NextButton
            onTouchEnd={this.handleTouchNext}
            isSkipDisabled={isSkipDisabled}
          >
            {isSkipDisabled ? '•••' : 'Next'}
          </NextButton>
        </GameContent>
      </GameBoard>
    );
  }
}

InGame.propTypes = {
  phrase: PropTypes.string.isRequired,
  pointsForTeamA: PropTypes.number.isRequired,
  pointsForTeamB: PropTypes.number.isRequired,
  onTouchNext: PropTypes.func.isRequired,
  onTouchStop: PropTypes.func.isRequired
};

export default InGame;
