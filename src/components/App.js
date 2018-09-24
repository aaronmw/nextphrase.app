import React, { Component } from "react";
import * as config from "../config";
import Home from "./Home";
import InGame from "./InGame";
import Settings from "./Settings";
import { playSound } from "../utils/sounds";
import shuffle from "../shuffle";
import lists from "../lists";

class App extends Component {
  constructor(props) {
    super(props);

    const savedSelectedLists = JSON.parse(
      window.localStorage.getItem("selectedLists")
    );
    const selectedLists =
      savedSelectedLists && savedSelectedLists.length
        ? savedSelectedLists
        : config.DEFAULT_LISTS;
    const phrases = [];

    selectedLists.forEach(value => {
      phrases.push(...lists[value]);
    });

    this.toggleScreenRotation = this.toggleScreenRotation.bind(this);
    const isRotated =
      window.localStorage.getItem("isRotated") === "true" ? true : false;

    console.log("Rotation in Local Storage:", isRotated);

    this.state = {
      phrases: shuffle(phrases),
      phraseIndex: 0,
      activeRoute: "home",
      pointsForTeamA: 0,
      pointsForTeamB: 0,
      selectedLists,
      isRotated
    };
  }

  buildPhrases = listNames => {
    const phrases = [];

    listNames.forEach(listName => {
      phrases.push(...lists[listName]);
    });

    this.setState({ phrases: shuffle(phrases) });
  };

  saveLists = (listName, isSelected) => {
    const { selectedLists } = this.state;

    let newSelectedLists = isSelected
      ? selectedLists.concat([listName])
      : selectedLists.filter(item => item !== listName);

    this.setState({
      selectedLists: newSelectedLists
    });

    this.buildPhrases(newSelectedLists);
    window.localStorage.setItem(
      "selectedLists",
      JSON.stringify(newSelectedLists)
    );
    playSound("typewriter");
  };

  toggleScreenRotation = () => {
    this.setState(state => {
      const newState = !state.isRotated;
      window.localStorage.setItem(
        "isRotated",
        newState === true ? "true" : "false"
      );
      return {
        isRotated: newState
      };
    });
    playSound("typewriter");
  };

  goTo = (routeName, audible = true) => {
    this.setState({ activeRoute: routeName });
    if (audible) {
      playSound("woosh");
    }
  };

  setScore = (newPointsForTeamA, newPointsForTeamB) => {
    if (
      newPointsForTeamA === config.MAX_SCORE ||
      newPointsForTeamB === config.MAX_SCORE
    ) {
      this.setState({ pointsForTeamA: 0, pointsForTeamB: 0 });
      playSound("celebration");
      return;
    }

    const currentPointsForTeamA = this.state.pointsForTeamA;
    const currentPointsForTeamB = this.state.pointsForTeamB;

    if (
      newPointsForTeamA + newPointsForTeamB <
      currentPointsForTeamA + currentPointsForTeamB
    ) {
      playSound("oops");
    } else {
      playSound("typewriter");
    }

    this.setState({
      pointsForTeamA: newPointsForTeamA,
      pointsForTeamB: newPointsForTeamB
    });
  };

  startGame = () => {
    this.incrementPhraseIndex();
    this.startTimers();
    this.goTo("in-game");
  };

  stopGame = () => {
    this.stopTimers();
    this.goTo("home");
  };

  incrementPhraseIndex = () => {
    this.setState(({ phraseIndex }) => ({
      phraseIndex: phraseIndex + 1
    }));
  };

  nextPhrase = () => {
    this.incrementPhraseIndex();
    playSound("woosh");
  };

  tick = () => {
    this._tickTimer = setTimeout(this.tick, this._tickRate);
    playSound("tickTock");
  };

  startTimers = () => {
    const roundTime = Math.round(
      config.MIN_ROUND_TIME +
        (config.MAX_ROUND_TIME - config.MIN_ROUND_TIME) * Math.random()
    );

    const rushDuration = Math.round(
      config.MIN_RUSH_DURATION +
        (config.MAX_RUSH_DURATION - config.MIN_RUSH_DURATION) * Math.random()
    );

    this._tickRate = config.DEFAULT_TICK_RATE;
    this._speedUpTimer = setTimeout(() => {
      this._tickRate = config.FAST_TICK_RATE;
      this.setState({
        isRushing: true
      });
    }, roundTime - rushDuration);

    this._roundTimer = setTimeout(this.endRound, roundTime);

    this.tick();
  };

  stopTimers = () => {
    clearTimeout(this._tickTimer);
    clearTimeout(this._speedUpTimer);
    clearTimeout(this._roundTimer);
    this.setState({
      isRushing: false
    });
  };

  endRound = () => {
    this.stopTimers();
    this.goTo("home", false);
    playSound("beep");
  };

  render() {
    const {
      activeRoute,
      pointsForTeamA,
      pointsForTeamB,
      phrases,
      phraseIndex,
      selectedLists,
      isRotated,
      isRushing
    } = this.state;

    switch (activeRoute) {
      case "home":
      default:
        return (
          <Home
            isRotated={isRotated}
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
            isRotated={isRotated}
            isRushing={isRushing}
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
            isRotated={isRotated}
            selectedLists={selectedLists}
            onTouchDone={this.goTo.bind(this, "home")}
            onTouchList={this.saveLists}
            onToggleScreenRotation={this.toggleScreenRotation}
          />
        );
    }
  }
}

export default App;
