import React, { Component } from "react";
// import shuffle from "../shuffle";
// import lists from "../lists";
// import InGame from "./InGame";
import Home from "./Home";
// import Settings from "./Settings";
import { playSound } from "../utils/sounds";

// const PHRASES = shuffle(lists["StarWars"]);
const MAX_SCORE = 7;
const DEFAULT_TICK_RATE = 500;
const FAST_TICK_RATE = 250;
const MIN_ROUND_TIME = 45 * 1000;
const MAX_ROUND_TIME = 60 * 1000;
const RUSH_DURATION = 5 * 1000;

class App extends Component {
  state = {
    activeRoute: "home",
    pointsForTeamA: 0,
    pointsForTeamB: 0,
    phraseIndex: 0,
    selectedLists: ["StarWars"]
  };

  setScore = (teamA, teamB) => {
    if (teamA === MAX_SCORE || teamB === MAX_SCORE) {
      this.endGame();
      return;
    }

    this.setState({
      pointsForTeamA: teamA,
      pointsForTeamB: teamB,
    });
    playSound("typewriter");
  };

  startGame = () => {
    this.setState({
      isPlaying: true,
      phraseIndex: this.state.phraseIndex + 1,
    });

    this.startTimers();
  };

  stopGame = () => {
    this.setState({ isPlaying: false });
    this.stopTimers();
    playSound("woosh");
  };

  nextPhrase = () => {
    this.setState({ phraseIndex: this.state.phraseIndex + 1 });
    playSound("woosh");
  };

  endGame = () => {
    this.setScore(0, 0);
    this.goTo("home");
  };

  tick = () => {
    this.tickTimer = setTimeout(this.tick, this.state.tickRate);
    playSound("tickTock");
  };

  goTo = routeName => {
    this.setState({ activeRoute: routeName })
    playSound("woosh");
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
      isPlaying: false,
      tickRate: DEFAULT_TICK_RATE
    });
    this.stopTimers();
    playSound("beep");
  };

  render() {
    const { activeRoute, pointsForTeamA, pointsForTeamB, phraseIndex, selectedLists } = this.state;

    return (
      <Home
        pointsForTeamA={pointsForTeamA}
        pointsForTeamB={pointsForTeamB}
        onStartGame={this.startGame}
        onTouchSettings={this.goTo.bind(this, "settings")}
        onScoreChange={this.setScore}
      />
    );

    /*
    // Routing, sort of
    switch (activeRoute) {
      case "home":
      default:
        return (
          <Home
            pointsForTeamA={pointsForTeamA}
            pointsForTeamB={pointsForTeamB}
            onStartGame={this.startGame}
            onTouchSettings={this.goTo.bind(this, "settings")}
            onScoreChange={this.setScore}
          />
        );

      /*
      case "in-game":
        return (
          <InGame
            phrases={phrases}
            pointsForTeamA={pointsForTeamA}
            pointsForTeamB={pointsForTeamB}
            onTouchNext={nextPhrase}
            onTouchStop={stopGame}
          />
        );
        break;

      case "settings"
        return (
          <Settings
            selectedLists={selectedLists}
            onTouchSave={saveSelectedLists}
          />
        );
        break;
    }
    */
  }
}

export default App;
