import React, { Component, PropTypes } from "react";
import styled from "styled-components";
import { GameBoard, GameHeader, GameButton, GameContent } from "./GameElements";

const NextButton = styled(GameButton)`
  width: 100%;
  height: 33.333%;
`;

const PhraseDisplay = styled.div`
  display: flex;
  padding: 20px;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1.6em;
  line-height: 1.1;
  width: 100%;
  height: 66.666%;
  background: ${ props => props.theme.secondary };
  color: ${ props => props.theme.primary };
`;

class InGame extends Component {
  render() {
    const { phrases, phraseIndex, pointsForTeamA, pointsForTeamB, onTouchNext, onTouchStop } = this.props;

    return (
      <GameBoard>
        <GameHeader
          buttonIcon="pause"
          onTouchButton={onTouchStop}
          pointsForTeamA={pointsForTeamA}
          pointsForTeamB={pointsForTeamB}
        />
        <GameContent>
          <PhraseDisplay>
            {phrases[phraseIndex % phrases.length].replace("'", "\u2019")}
          </PhraseDisplay>
          <NextButton onTouchEnd={onTouchNext}>Next</NextButton>
        </GameContent>
      </GameBoard>
    );
  }
};

InGame.propTypes = {
  phrases: PropTypes.arrayOf(PropTypes.string).isRequired,
  phraseIndex: PropTypes.number.isRequired,
  pointsForTeamA: PropTypes.number.isRequired,
  pointsForTeamB: PropTypes.number.isRequired,
  onTouchNext: PropTypes.func.isRequired,
  onTouchStop: PropTypes.func.isRequired,
};

export default InGame;
