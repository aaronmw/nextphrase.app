import React, { Component, PropTypes } from "react";
import styled from "styled-components";
import { GameBoard, GameHeader, GameButton, GameContent } from "./GameElements";
import { LONG_PRESS_DURATION } from "../config";

const ScoreButton = styled(GameButton)`
  width: 50%;
  height: 33%;
  line-height: 100%;
  border-bottom: none;

  &:nth-child(1) {
    border-right-width: ${props => props.theme.halfBorderWidth};
  }
  &:nth-child(2) {
    border-left-width: ${props => props.theme.halfBorderWidth};
  }
`;

const StartButton = styled(GameButton)`
  width: 100%;
  height: 67%;
`;

class Home extends Component {
  isLongPress = () => {
    const currentTime = Date.now();
    const buttonDownTime = currentTime - this._buttonDownTime;
    return buttonDownTime >= LONG_PRESS_DURATION;
  };

  addPointForTeamA = e => {
    const { pointsForTeamA, pointsForTeamB, onTouchScore } = this.props;
    if (this.isLongPress()) {
      onTouchScore(pointsForTeamA - 1, pointsForTeamB);
    } else {
      onTouchScore(pointsForTeamA + 1, pointsForTeamB);
    }
  };

  addPointForTeamB = () => {
    const { pointsForTeamA, pointsForTeamB, onTouchScore } = this.props;
    if (this.isLongPress()) {
      onTouchScore(pointsForTeamA, pointsForTeamB - 1);
    } else {
      onTouchScore(pointsForTeamA, pointsForTeamB + 1);
    }
  };

  setButtonDownTime = () => {
    this._buttonDownTime = Date.now();
  };

  render() {
    const {
      pointsForTeamA,
      pointsForTeamB,
      onTouchStart,
      onTouchSettings,
      isRotated
    } = this.props;

    return (
      <GameBoard isRotated={isRotated}>
        <GameHeader
          buttonIcon="cog"
          onTouchButton={onTouchSettings}
          pointsForTeamA={pointsForTeamA}
          pointsForTeamB={pointsForTeamB}
        />
        <GameContent>
          <ScoreButton
            onTouchStart={this.setButtonDownTime}
            onTouchEnd={this.addPointForTeamA}
          >
            A
          </ScoreButton>
          <ScoreButton
            onTouchStart={this.setButtonDownTime}
            onTouchEnd={this.addPointForTeamB}
          >
            B
          </ScoreButton>
          <StartButton onTouchEnd={onTouchStart}>Start</StartButton>
        </GameContent>
      </GameBoard>
    );
  }
}

Home.propTypes = {
  pointsForTeamA: PropTypes.number.isRequired,
  pointsForTeamB: PropTypes.number.isRequired,
  onTouchStart: PropTypes.func.isRequired,
  onTouchSettings: PropTypes.func.isRequired,
  onTouchScore: PropTypes.func.isRequired
};

export default Home;
