import React, { Component, PropTypes } from "react";
import styled from "styled-components";
import { GameBoard, GameHeader, GameButton, GameContent } from "./GameElements";

const ScoreButton = styled(GameButton)`
  width: 50%;
  height: 33.333%;
`;

const StartButton = styled(GameButton)`
  width: 100%;
  height: 66.666%;
`;

class Home extends Component {
  addPointForTeam = teamName => {
    let { pointsForTeamA, pointsForTeamB, onTouchScore } = this.props;
    (teamName === "A") ? pointsForTeamA++ : pointsForTeamB++;
    onTouchScore(pointsForTeamA, pointsForTeamB);
  };

  addPointForTeamA = () => {
    this.addPointForTeam("A");
  };

  addPointForTeamB = () => {
    this.addPointForTeam("B");
  };

  render() {
    const { pointsForTeamA, pointsForTeamB, onTouchStart, onTouchSettings } = this.props;

    return (
      <GameBoard>
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
};

Home.propTypes = {
  pointsForTeamA: PropTypes.number.isRequired,
  pointsForTeamB: PropTypes.number.isRequired,
  onTouchStart: PropTypes.func.isRequired,
  onTouchSettings: PropTypes.func.isRequired,
  onTouchScore: PropTypes.func.isRequired,
};

export default Home;
