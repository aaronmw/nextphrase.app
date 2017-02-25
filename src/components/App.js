import React, { Component } from "react";
import * as config from "../config";
import shuffle from "../shuffle";
import lists from "../lists";
import Home from "./Home";
import InGame from "./InGame";
import Settings from "./Settings";
import { playSound } from "../utils/sounds";

// const config.PHRASES = shuffle(lists["StarWars"]);

class App extends Component {
  constructor (props) {
    super(props);

    let savedSelectedLists = JSON.parse(window.localStorage.getItem("selectedLists"));
    const selectedLists = savedSelectedLists && savedSelectedLists.length ? savedSelectedLists : config.DEFAULT_LISTS;

    let phrases = [];
    selectedLists.forEach(value => {
      phrases = phrases.concat(lists[value]);
    });
    phrases = shuffle(phrases);

    this.state = {
      activeRoute: "home",
      pointsForTeamA: 0,
      pointsForTeamB: 0,
      phraseIndex: 0,
      tickRate: config.DEFAULT_TICK_RATE,
      selectedLists,
      phrases,
    };
  };

  buildPhrases = (newSelectedLists) => {
    let newPhrases = [];
    newSelectedLists.forEach(value => {
      newPhrases = newPhrases.concat(lists[value]);
    });
    newPhrases = shuffle(newPhrases);
    this.setState({
      phrases: newPhrases,
    });
  };

  saveLists = (listName, isSelected) => {
    const { selectedLists } = this.state;

    let newSelectedLists = isSelected ?
      selectedLists.concat([listName])
    : selectedLists.filter(item => item !== listName);

    this.setState({
      selectedLists: newSelectedLists,
    });

    this.buildPhrases(newSelectedLists);
    window.localStorage.setItem("selectedLists", JSON.stringify(newSelectedLists));
    playSound("typewriter");
  };

  goTo = routeName => {
    this.setState({ activeRoute: routeName })
    playSound("woosh");
  };

  setScore = (teamA, teamB) => {
    if (teamA === config.MAX_SCORE || teamB === config.MAX_SCORE) {
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
      phraseIndex: this.state.phraseIndex + 1,
    });

    this.startTimers();
    this.goTo('in-game');
  };

  stopGame = () => {
    this.stopTimers();
    playSound("woosh");
    this.goTo("home");
  };

  nextPhrase = () => {
    this.setState({ phraseIndex: this.state.phraseIndex + 1 });
    playSound("woosh");
  };

  endGame = () => {
    this.setScore(0, 0);
    this.goTo("home");
    playSound("celebration");
  };

  tick = () => {
    this.tickTimer = setTimeout(this.tick, this.state.tickRate);
    playSound("tickTock");
  };

  startTimers = () => {
    const roundTime = Math.round(config.MIN_ROUND_TIME + ((config.MAX_ROUND_TIME - config.MIN_ROUND_TIME) * Math.random()));

    this.tick();

    this.speedUpTimer = setTimeout(() => {
      this.setState({ tickRate: config.FAST_TICK_RATE })
    }, roundTime - config.RUSH_DURATION);

    this.roundTimer = setTimeout(this.endRound, roundTime);
  };

  stopTimers = () => {
    clearTimeout(this.tickTimer);
    clearTimeout(this.speedUpTimer);
    clearTimeout(this.roundTimer);
  };

  endRound = () => {
    this.setState({
      tickRate: config.DEFAULT_TICK_RATE
    });
    this.stopTimers();
    playSound("beep");
  };

  render() {
    const { activeRoute, pointsForTeamA, pointsForTeamB, phrases, phraseIndex, selectedLists } = this.state;

    switch (activeRoute) {
      case "home":
      default:
        return (
          <Home
            pointsForTeamA={pointsForTeamA}
            pointsForTeamB={pointsForTeamB}
            onTouchStart={this.startGame}
            onTouchSettings={this.goTo.bind(this, "settings")}
            onTouchScore={this.setScore}
          />
        );

      case "in-game":
        return (
          <InGame
            phrases={phrases}
            phraseIndex={phraseIndex}
            pointsForTeamA={pointsForTeamA}
            pointsForTeamB={pointsForTeamB}
            onTouchNext={this.nextPhrase}
            onTouchStop={this.stopGame}
          />
        );

      case "settings":
        return (
          <Settings
            selectedLists={selectedLists}
            onTouchDone={this.goTo.bind(this, "home")}
            onTouchList={this.saveLists}
          />
        );
    }
  }
}

export default App;
