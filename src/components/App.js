import React, { Component } from "react";
import styled from "styled-components";
import shuffle from "../shuffle";
import phrases from "../phrases";
import Header from "./Header";
import Settings from "./Settings";
import TouchButton from "./TouchButton";

const PHRASES = shuffle(phrases);
const MAX_SCORE = 7;
const DEFAULT_TICK_RATE = 500;
const FAST_TICK_RATE = 250;
const MIN_ROUND_TIME = 45 * 1000;
const MAX_ROUND_TIME = 60 * 1000;
const RUSH_DURATION = 5 * 1000;

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

      // Celebrate sounds here
    } else {
      this.setState({ [key]: this.state[key] + 1 });

      // point click sounds here
    }
  };

  handleTouchStart = () => {
    this.setState({
      isPlaying: true,
      phraseIndex: (this.state.phraseIndex + 1) % PHRASES.length
    });

    this.startTimers();
  };

  handleTouchNext = () => {
    this.setState({
      phraseIndex: (this.state.phraseIndex + 1) % PHRASES.length
    });
  };

  handleTouchStop = () => {
    this.setState({ isPlaying: false });
    this.stopTimers();
  };

  tick = () => {
    this.tickTimer = setTimeout(this.tick, this.state.tickRate);
    console.log('TICK');
  };

  handleTouchSettings = () => {
    this.setState({ showSettings: true });
  };

  handleSaveSettings = () => {
    this.setState({ showSettings: false });
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

    return isPlaying ? (
      <Game>
        <GameBoard>
          <Header>
            <Score points={pointsForTeamA} />
            <TouchButton borderless icon onTouchEnd={this.handleTouchStop}>
              &#xf04c;
            </TouchButton>
            <Score points={pointsForTeamB} reverse />
          </Header>
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
            {PHRASES[phraseIndex]}
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
        </GameBoard>
      </Game>
    ) : (
      <Game>
        <Settings isVisible={showSettings} onSave={this.handleSaveSettings} />
        <GameBoard showSettings={showSettings}>
          <Header>
            <Score points={pointsForTeamA} />
            <TouchButton borderless icon onTouchEnd={this.handleTouchSettings}>
              &#xf013;
            </TouchButton>
            <Score points={pointsForTeamB} reverse />
          </Header>
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
        </GameBoard>
      </Game>
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

const Game = styled.div`
  background-color: ${props => props.theme.secondary};
  font-family: 'Helvetica Neue';
  font-weight: bold;
  text-transform: uppercase;
  color: ${props => props.theme.primary};
  width: 100vw;
  height: 100vh;
`;

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
  border: 1px solid ${props => props.theme.secondary};
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
