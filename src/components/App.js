import React, { Component } from "react";
import shuffle from "../shuffle";
import phrases from "../phrases";
import InGame from "./InGame";
import Home from "./Home";
import Settings from "./Settings";
import { playSound } from "../utils/sounds";

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
      this.setState({ pointsForTeamA: 0, pointsForTeamB: 0 });
      playSound('winRound');
    } else {
      this.setState({ [key]: newScore });
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
            <Home
              showSettings={showSettings}
              pointsForTeamA={pointsForTeamA}
              pointsForTeamB={pointsForTeamB}
              onStartGame={this.handleTouchStart}
              onTouchSettings={this.handleTouchSettings}
              onTouchA={this.handleTouchA}
              onTouchB={this.handleTouchB}
            />
          </div>
        )}
      </div>
    );
  }
}

export default App;
