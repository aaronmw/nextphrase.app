import React, { Component } from "react";
import styled from "styled-components";
import shuffle from "../shuffle";
import lists from "../lists";
import InGame from "./InGame";
import Settings from "./Settings";
import Screen from "./Screen";
import TouchButton from "./TouchButton";
import { playSound } from "../utils/sounds";

const PHRASES = shuffle(lists['StarWars']);
const MAX_SCORE = 7;
const DEFAULT_TICK_RATE = 500;
const FAST_TICK_RATE = 250;
const MIN_ROUND_TIME = 45 * 1000;
const MAX_ROUND_TIME = 60 * 1000;
const RUSH_DURATION = 5 * 1000;

const Header = styled.div`
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  justify-content: space-around;
  height: 50px;
  background-color: ${props => props.theme.primary};
  border: 1px solid ${props => props.theme.secondary};
  color: ${props => props.theme.secondary};
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
`;

class App extends Component {
  state = {
    showSettings: false,
    isPlaying: false,
    pointsForTeamA: 0,
    pointsForTeamB: 0,
    phraseIndex: 0,
    tickRate: DEFAULT_TICK_RATE,
  };

  handleTouchA = () => {
    this.addPointForTeam("A");
  };

  handleTouchB = () => {
    this.addPointForTeam("B");
  };

  addPointForTeam = teamName => {
    const key = "pointsForTeam" + teamName;
    const newScore = this.state[key] + 1;

    if (newScore > MAX_SCORE) {
      this.setState({
        pointsForTeamA: 0,
        pointsForTeamB: 0,
      });

      playSound('winRound');
    } else {
      this.setState({ [key]: this.state[key] + 1 });

      playSound('addPoint');
    }
  };

  handleTouchStart = () => {
    this.setState({
      isPlaying: true,
      phraseIndex: (this.state.phraseIndex + 1) % PHRASES.length
    });

    this.startTimers();
  };

  handleTouchStop = () => {
    this.setState({ isPlaying: false });
    this.stopTimers();
    playSound('nextPhrase');
  };

  tick = () => {
    this.tickTimer = setTimeout(this.tick, this.state.tickRate);
    playSound('timerTick');
  };

  handleTouchSettings = () => {
    this.setState({ showSettings: true });
    playSound('nextPhrase');
  };

  handleSaveSettings = () => {
    this.setState({ showSettings: false });
    playSound('nextPhrase');
  };

  startTimers = () => {
    const roundTime = Math.round(MIN_ROUND_TIME + ((MAX_ROUND_TIME - MIN_ROUND_TIME) * Math.random()));

    this.tick();

    this.speedUpTimer = setTimeout(() => {
      this.setState({ tickRate: FAST_TICK_RATE })
    }, roundTime - RUSH_DURATION);

    this.roundTimer = setTimeout(this.endRound, roundTime);
  };

  stopTimers = () => {
    clearTimeout(this.tickTimer);
    clearTimeout(this.speedUpTimer);
    clearTimeout(this.roundTimer);
  };

  endRound = () => {
    this.setState({
      isPlaying: false
    });
    this.stopTimers();
  };

  render() {
    const { isPlaying, pointsForTeamA, pointsForTeamB, phraseIndex, showSettings } = this.state;

    return (
      <div>
        {isPlaying ? (
          <InGame
            phrases={PHRASES}
            phraseIndex={phraseIndex}
            pointsForTeamA={pointsForTeamA}
            pointsForTeamB={pointsForTeamB}
            onStopGame={this.handleTouchStop}
          />
        ) : (
          <div>
            <Settings isVisible={showSettings} onSave={this.handleSaveSettings} />
            <GameBoard showSettings={showSettings}>
              <Screen
                header={(
                  <HeaderWrapper>
                    <Score points={pointsForTeamA} />
                    <TouchButton borderless icon onTouchEnd={this.handleTouchSettings}>
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
                      <ScoreButton teamName="A" onTouchEnd={this.handleTouchA} />
                      <ScoreButton teamName="B" onTouchEnd={this.handleTouchB} />
                    </div>
                    <TouchButton
                      style={{
                        display: "block",
                        flexGrow: 2
                      }}
                      onTouchEnd={this.handleTouchStart}
                    >
                      Start
                    </TouchButton>
                  </div>
                )}
              />
            </GameBoard>
          </div>
        )}
      </div>
    );
  }
}

const Score = ({ points, reverse }) => {
  const pointElements = [];

  for (var i = 1; i <= 7; i++) {
    pointElements.push((
      <Point key={i} filled={i <= points} />
    ));
  }

  if (reverse) {
    pointElements.reverse();
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {pointElements}
    </div>
  );
};

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

const Point = styled.div`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.secondary};
  background: ${ props => props.filled ? props.theme.secondary : "none" };
  opacity: ${ props => props.filled ? 1 : 0.5 };
  transition: all 0.1s ease-in-out;

  &:not(:first-child) {
    margin-left: 2px;
  }
`;

const ScoreButton = ({ teamName, onTouchEnd }) => (
  <TouchButton onTouchEnd={onTouchEnd} style={{ flexBasis: "50%" }}>
    {teamName}
  </TouchButton>
);

export default App;
