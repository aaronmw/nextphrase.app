import React, { Component, PropTypes } from "react";
import styled from "styled-components";
import { GameBoard, GameHeader, GameButton, GameContent } from "./GameElements";

const ScoreButton = styled(GameButton)`
  width: 50%;
  height: 33%;
  line-height: 100%;
  border-bottom: none;
  &:first-child {
    border-right: none;
  }
`;

const StartButton = styled(GameButton)`
  width: 100%;
  height: 67%;
`;

class Home extends Component {
  addPointForTeamA = () => {
    const { pointsForTeamA, pointsForTeamB, onTouchScore } = this.props;
    onTouchScore(pointsForTeamA + 1, pointsForTeamB);
  };

  addPointForTeamB = () => {
    const { pointsForTeamA, pointsForTeamB, onTouchScore } = this.props;
    onTouchScore(pointsForTeamA, pointsForTeamB + 1);
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
          <ScoreButton onTouchEnd={this.addPointForTeamA}>A</ScoreButton>
          <ScoreButton onTouchEnd={this.addPointForTeamB}>B</ScoreButton>
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
