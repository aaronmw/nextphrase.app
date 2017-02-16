import React, { PropTypes, Component } from "react";
import styled from "styled-components";
import TouchButton from "./TouchButton";
import Score from "./Score";
import Screen from "./Screen";

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

const ScoreButton = ({ teamName, onTouchEnd }) => (
  <TouchButton onTouchEnd={onTouchEnd} style={{ flexBasis: "50%" }}>
    {teamName}
  </TouchButton>
);

const HeaderWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
`;

class Home extends Component {
  static propTypes = {
    pointsForTeamA: PropTypes.number.isRequired,
    pointsForTeamB: PropTypes.number.isRequired,
    showSettings: PropTypes.bool.isRequired,
    onStartGame: PropTypes.func.isRequired,
    onTouchA: PropTypes.func.isRequired,
    onTouchB: PropTypes.func.isRequired,
    onTouchSettings: PropTypes.func.isRequired,
  };

  render () {
    const {
      showSettings,
      pointsForTeamA,
      pointsForTeamB,
      onTouchSettings,
      onStartGame,
      onTouchA,
      onTouchB,
    } = this.props;

    return (
      <GameBoard showSettings={showSettings}>
        <Screen
          header={(
            <HeaderWrapper>
              <Score points={pointsForTeamA} />
              <TouchButton borderless icon onTouchEnd={onTouchSettings}>
                &#xf013;
              </TouchButton>
              <Score points={pointsForTeamB} reverse />
            </HeaderWrapper>
          )}
          body={(
            <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
              <div style={{
                display: "flex",
                alignItems: "stretch",
                flexGrow: 1
              }}>
                <ScoreButton teamName="A" onTouchEnd={onTouchA} />
                <ScoreButton teamName="B" onTouchEnd={onTouchB} />
              </div>
              <TouchButton
                style={{
                  display: "block",
                  flexGrow: 2
                }}
                onTouchEnd={onStartGame}
              >
                Start
              </TouchButton>
            </div>
          )}
        />
      </GameBoard>
    );
  }
}

export default Home;
