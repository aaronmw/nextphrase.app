import React, { Component, PropTypes } from "react";
import { NEXT_BUTTON_FREEZE_TIME } from "../config";
import PhraseSwitcher from "./PhraseSwitcher";
import styled from "styled-components";
import { GameBoard, GameHeader, GameButton, GameContent } from "./GameElements";

const NextButton = styled(GameButton)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 33.333%;
  background: ${ props => props.theme.primary };
  z-index: 1000;
  transition: color 0.2s ease-in-out;

  ${ props => props.isFrozen ? `
    color: rgba(255,255,255,0.2);

    &:active {
      background: none;
    }
  ` : ""}
`;

class InGame extends Component {
  state = { isFrozen: true };

  componentDidMount () {
    this.unfreezeTimer = setTimeout(() => {
      this.setState({ isFrozen: false });
    }, NEXT_BUTTON_FREEZE_TIME * 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.unfreezeTimer);
  }

  handleTouchNext = () => {
    if (this.state.isFrozen) { return; }

    this.setState({ isFrozen: true });

    this.unfreezeTimer = setTimeout(() => {
      this.setState({ isFrozen: false });
    }, NEXT_BUTTON_FREEZE_TIME * 1000);

    this.props.onTouchNext();
  };

  render() {
    const { pointsForTeamA, pointsForTeamB, onTouchStop, phrase } = this.props;
    const { isFrozen } = this.state;

    return (
      <GameBoard>
        <GameHeader
          buttonIcon="pause"
          onTouchButton={onTouchStop}
          pointsForTeamA={pointsForTeamA}
          pointsForTeamB={pointsForTeamB}
        />
        <GameContent>
          <PhraseSwitcher phrase={phrase} />
          <NextButton onTouchEnd={this.handleTouchNext} isFrozen={isFrozen}>Next</NextButton>
        </GameContent>
      </GameBoard>
    );
  }
};

InGame.propTypes = {
  phrase: PropTypes.string.isRequired,
  pointsForTeamA: PropTypes.number.isRequired,
  pointsForTeamB: PropTypes.number.isRequired,
  onTouchNext: PropTypes.func.isRequired,
  onTouchStop: PropTypes.func.isRequired,
};

export default InGame;
