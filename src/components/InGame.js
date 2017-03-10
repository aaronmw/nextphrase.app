import React, { Component, PropTypes } from "react";
import styled, { keyframes } from "styled-components";
import { GameBoard, GameHeader, GameButton, GameContent } from "./GameElements";

const NextButton = styled(GameButton)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 33.333%;
  background: ${ props => props.theme.primary };
  z-index: 1000;
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
  display: flex;
  padding: 20px;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1.1;
  width: 100%;
  height: 66.666%;
  background: ${ props => props.theme.secondary };
  color: ${ props => props.theme.primary };
  animation: ${newPhrase} 0.125s linear;
`;

class Phrase extends Component {
  render() {
    return (
      <PhraseCanvas>
        {this.props.text.replace("'", "\u2019")}
      </PhraseCanvas>
    );
  }
};

class InGame extends Component {
  constructor(props) {
    super(props);
    const { phrase } = this.props;

    this.state = {
      phraseKey: 0,
      phraseHistory: [<Phrase key={0} text={phrase} />],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { phrase } = nextProps;
    const { phraseHistory, phraseKey } = this.state;

    this.setState((prevState, prevProps) => ({
      phraseKey: prevState.phraseKey + 1,
      phraseHistory: prevState.phraseHistory.concat(<Phrase key={prevState.phraseKey + 1} text={phrase} />),
    }));
  }

  render() {
    const { pointsForTeamA, pointsForTeamB, onTouchNext, onTouchStop } = this.props;

    return (
      <GameBoard>
        <GameHeader
          buttonIcon="pause"
          onTouchButton={onTouchStop}
          pointsForTeamA={pointsForTeamA}
          pointsForTeamB={pointsForTeamB}
        />
        <GameContent>
          {this.state.phraseHistory}
          <NextButton onTouchEnd={onTouchNext}>Next</NextButton>
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
