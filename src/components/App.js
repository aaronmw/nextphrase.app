import React, { Component } from "react";
import * as config from "../config";
import Home from "./Home";
import InGame from "./InGame";
import Settings from "./Settings";
import { playSound } from "../utils/sounds";
import shuffle from "../shuffle";
import lists from "../lists";

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
      phrases: phrases,
      phraseIndex: 0,
      activeRoute: "home",
      pointsForTeamA: 0,
      pointsForTeamB: 0,
      selectedLists,
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

  goTo = (routeName, audible = true) => {
    this.setState({ activeRoute: routeName });
    if (audible) {
      playSound("woosh");
    }
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
    this.startTimers();
    this.goTo("in-game");
  };

  stopGame = () => {
    this.stopTimers();
    this.incrementPhraseIndex();
    this.goTo("home");
  };

  incrementPhraseIndex = () => {
    this.setState((prevState, props) => ({
      phraseIndex: prevState.phraseIndex + 1
    }));
  };

  nextPhrase = () => {
    this.incrementPhraseIndex();
    playSound("woosh");
  };

  endGame = () => {
    this.setScore(0, 0);
    this.goTo("home", false);
    playSound("celebration");
  };

  tick = () => {
    this._tickTimer = setTimeout(this.tick, this._tickRate);
    playSound("tickTock");
  };

  startTimers = () => {
    const roundTime = Math.round(config.MIN_ROUND_TIME + ((config.MAX_ROUND_TIME - config.MIN_ROUND_TIME) * Math.random()));

    this._tickRate = config.DEFAULT_TICK_RATE;
    this._speedUpTimer = setTimeout(() => {
      this._tickRate = config.FAST_TICK_RATE;
    }, roundTime - config.RUSH_DURATION);

    this._roundTimer = setTimeout(this.endRound, roundTime);

    this.tick();
  };

  stopTimers = () => {
    clearTimeout(this._tickTimer);
    clearTimeout(this._speedUpTimer);
    clearTimeout(this._roundTimer);
  };

  endRound = () => {
    this.stopTimers();
    this.goTo("home", false);
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
            phrase={phrases[phraseIndex % phrases.length]}
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
