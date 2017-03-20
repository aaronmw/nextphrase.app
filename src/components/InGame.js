import React, { Component, PropTypes } from "react";
import { NEXT_BUTTON_FREEZE_TIME } from "../config";
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
  transition: color 0.2s ease-in-out;

  ${ props => props.isFrozen ? `
    color: rgba(255,255,255,0.2);

    &:active {
      background: none;
    }
  ` : ""}
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

const Phrase = ({ text }) => <PhraseCanvas>{text.replace("'", "\u2019")}</PhraseCanvas>;

class InGame extends Component {
  constructor(props) {
    super(props);

    const { phrase } = props;

    this.state = {
      isFrozen: true,
      phraseKey: 0,
      phraseHistory: [<Phrase key={0} text={phrase} />],
    };

    this.unfreezeTimer = setTimeout(() => {
      this.setState({ isFrozen: false });
    }, NEXT_BUTTON_FREEZE_TIME * 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.unfreezeTimer);
  }

  componentWillReceiveProps(nextProps) {
    const { phrase } = nextProps;

    this.setState(state => ({
      phraseKey: state.phraseKey + 1,
      phraseHistory: state.phraseHistory.concat(<Phrase key={state.phraseKey + 1} text={phrase} />),
    }));
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
    const { pointsForTeamA, pointsForTeamB, onTouchStop } = this.props;
    const { phraseHistory, isFrozen } = this.state;

    return (
      <GameBoard>
        <GameHeader
          buttonIcon="pause"
          onTouchButton={onTouchStop}
          pointsForTeamA={pointsForTeamA}
          pointsForTeamB={pointsForTeamB}
        />
        <GameContent>
          {phraseHistory}
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
