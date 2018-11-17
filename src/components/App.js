import React, { Component } from 'react';
import * as config from '../config';
import Home from './Home';
import InGame from './InGame';
import Settings from './Settings';
import { playSound } from '../utils/sounds';
import shuffle from '../shuffle';
import lists from '../lists';

class App extends Component {
  constructor(props) {
    super(props);

    const initialState = {
      phrases: [],
      phraseIndex: 0,
      roundJustCompleted: false,
      activeRoute: 'home',
      pointsForTeamA: 0,
      pointsForTeamB: 0,
      selectedLists: config.DEFAULT_LISTS,
      isRotated: false
    };

    /*
      Check localStorage for any of our initialState
    */
    Object.keys(initialState).forEach(stateVariable => {
      const savedStateVariable = window.localStorage.getItem(stateVariable);

      if (savedStateVariable !== null) {
        initialState[stateVariable] = JSON.parse(savedStateVariable);
      }
    });

    // If we didn't get any phrases from the
    // local storage, we need to build the
    // list now and push it onto the initialState
    if (initialState.phrases.length === 0) {
      this.buildPhrases(initialState.selectedLists);
    }

    // Bound event handlers
    this.toggleScreenRotation = this.toggleScreenRotation.bind(this);

    // Set state to whatever initialState
    // has become by this point
    this.state = initialState;
  }

  buildPhrases = listNames => {
    let phrases = [];

    listNames.forEach(listName => {
      phrases.push(...lists[listName]);
    });

    phrases = shuffle(phrases);

    this.setState({ phrases });
    window.localStorage.setItem('phrases', JSON.stringify(phrases));
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
      'selectedLists',
      JSON.stringify(newSelectedLists)
    );

    playSound('typewriter');
  };

  toggleScreenRotation = () => {
    this.setState(state => {
      const newState = !state.isRotated;
      window.localStorage.setItem(
        'isRotated',
        JSON.stringify(newState === true ? true : false)
      );
      return {
        isRotated: newState
      };
    });
    playSound('typewriter');
  };

  goTo = (routeName, audible = true) => {
    this.setState({ activeRoute: routeName });
    if (audible) {
      playSound('woosh');
    }
  };

  setScore = (newPointsForTeamA, newPointsForTeamB) => {
    this.setState({
      roundJustCompleted: false
    });
    window.localStorage.setItem(
      'roundJustCompleted',
      JSON.stringify(false)
    );

    newPointsForTeamA = Math.max(0, newPointsForTeamA);
    newPointsForTeamB = Math.max(0, newPointsForTeamB);

    if (
      newPointsForTeamA === config.MAX_SCORE ||
      newPointsForTeamB === config.MAX_SCORE
    ) {
      this.setState({ pointsForTeamA: 0, pointsForTeamB: 0 });
      window.localStorage.setItem('pointsForTeamA', JSON.stringify(0));
      window.localStorage.setItem('pointsForTeamB', JSON.stringify(0));
      playSound('celebration');
      return;
    }

    const currentPointsForTeamA = this.state.pointsForTeamA;
    const currentPointsForTeamB = this.state.pointsForTeamB;

    if (
      newPointsForTeamA + newPointsForTeamB <
      currentPointsForTeamA + currentPointsForTeamB
    ) {
      playSound('oops');
    } else {
      playSound('typewriter');
    }

    this.setState({
      pointsForTeamA: newPointsForTeamA,
      pointsForTeamB: newPointsForTeamB
    });
    window.localStorage.setItem(
      'pointsForTeamA',
      JSON.stringify(newPointsForTeamA)
    );
    window.localStorage.setItem(
      'pointsForTeamB',
      JSON.stringify(newPointsForTeamB)
    );
  };

  startGame = () => {
    if (this.state.roundJustCompleted) {
      return;
    }
    this.incrementPhraseIndex();
    this.startTimers();
    this.goTo('in-game');
  };

  stopGame = () => {
    this.stopTimers();
    this.goTo('home');
  };

  incrementPhraseIndex = () => {
    this.setState(({ phraseIndex }) => {
      window.localStorage.setItem(
        'phraseIndex',
        JSON.stringify(phraseIndex + 1)
      );
      return {
        phraseIndex: phraseIndex + 1
      };
    });
  };

  nextPhrase = () => {
    this.incrementPhraseIndex();
    playSound('woosh');
  };

  tick = () => {
    this._tickTimer = setTimeout(this.tick, this._tickRate);
    playSound('tickTock');
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
    this.goTo('home', false);
    this.setState({ roundJustCompleted: true });
    playSound('beep');
  };

  render() {
    const {
      activeRoute,
      pointsForTeamA,
      pointsForTeamB,
      phrases,
      phraseIndex,
      roundJustCompleted,
      selectedLists,
      isRotated,
      isRushing
    } = this.state;

    switch (activeRoute) {
      case 'home':
      default:
        return (
          <Home
            isRotated={isRotated}
            roundJustCompleted={roundJustCompleted}
            pointsForTeamA={pointsForTeamA}
            pointsForTeamB={pointsForTeamB}
            onTouchStart={this.startGame}
            onTouchSettings={this.goTo.bind(this, 'settings')}
            onTouchScore={this.setScore}
          />
        );

      case 'in-game':
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

      case 'settings':
        return (
          <Settings
            isRotated={isRotated}
            selectedLists={selectedLists}
            onTouchDone={this.goTo.bind(this, 'home')}
            onTouchList={this.saveLists}
            onToggleScreenRotation={this.toggleScreenRotation}
          />
        );
    }
  }
}

export default App;
