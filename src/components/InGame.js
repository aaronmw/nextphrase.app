import React, { Component, PropTypes } from "react";
import styled from "styled-components";
import Score from "./Score";
import Screen from "./Screen";
import TouchButton from "./TouchButton";
import { playSound } from "../utils/sounds";

const GameBoard = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  background-color: inherit;
  color: inherit;
  align-items: stretch;
  width: 100vw;
  height: 100vh;
  backface-visibility: hidden;
  transition: all 0.25s ease-in-out;
  ${ props => props.showSettings ? `
    transform: rotate3d(0, 1, 0.1, 180deg);
    pointer-events: none;
    opacity: 0;
  ` : `
    transition-delay: 0.125s;
    transform: rotate3d(0, 1, 0.1, 0);
    opacity: 1;
  `}
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
`;

class InGame extends Component {
  static propTypes = {
    phrases: PropTypes.arrayOf(PropTypes.string).isRequired,
    pointsForTeamA: PropTypes.number.isRequired,
    pointsForTeamB: PropTypes.number.isRequired,
    onStopGame: PropTypes.func.isRequired,
  };

  state = { phraseIndex: 0 };

  handleTouchNext = () => {
    this.setState({ phraseIndex: this.state.phraseIndex + 1 });
    playSound('nextPhrase');
  };

  render () {
    const { pointsForTeamA, pointsForTeamB, phrases, onStopGame } = this.props;
    const { phraseIndex } = this.state;

    return (
      <GameBoard>
        <Screen
          header={(
            <HeaderWrapper>
              <Score points={pointsForTeamA} />
              <TouchButton borderless icon onTouchEnd={onStopGame}>
                &#xf04c;
              </TouchButton>
              <Score points={pointsForTeamB} reverse />
            </HeaderWrapper>
          )}
          body={(
            <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
              <div style={{
                display: "flex",
                flexBasis: "15vh",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                flexGrow: 2,
                fontSize: "250%",
                lineHeight: "1",
                padding: "15vw",
                color: "inherit",
                backgroundColor: "inherit",
              }}>
                {phrases[phraseIndex % phrases.length]}
              </div>
              <TouchButton
                style={{
                  display: "block",
                  flexGrow: 1
                }}
                onTouchEnd={this.handleTouchNext}
              >
                Next
              </TouchButton>
            </div>
          )}
        />
      </GameBoard>
    );
  }
}

export default InGame;
