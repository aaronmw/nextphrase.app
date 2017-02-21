import React, { Component, PropTypes } from "react";
import styled from "styled-components";
import { GameBoard, GameHeader, GameButton, GameContent } from "./GameElements"

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
    let { pointsForTeamA, pointsForTeamB, onScoreChange } = this.props;
    (teamName === "A") ? pointsForTeamA++ : pointsForTeamB++;
    onScoreChange(pointsForTeamA, pointsForTeamB);
  };

  render() {
    const { pointsForTeamA, pointsForTeamB, onStartGame, onTouchSettings } = this.props;

    return (
      <GameBoard>
        <GameHeader
          buttonIcon="cog"
          onTouchButton={onTouchSettings}
          pointsForTeamA={pointsForTeamA}
          pointsForTeamB={pointsForTeamB}
        />
        <GameContent>
          <ScoreButton onClick={this.addPointForTeam.bind(this, "A")}>A</ScoreButton>
          <ScoreButton onClick={this.addPointForTeam.bind(this, "B")}>B</ScoreButton>
          <StartButton onClick={onStartGame}>Start</StartButton>
        </GameContent>
      </GameBoard>
    );
  }
};

Home.propTypes = {
  pointsForTeamA: PropTypes.number.isRequired,
  pointsForTeamB: PropTypes.number.isRequired,
  onStartGame: PropTypes.func.isRequired,
  onTouchSettings: PropTypes.func.isRequired,
  onScoreChange: PropTypes.func.isRequired,
};

export default Home;
