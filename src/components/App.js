import { random, shuffle, times } from 'lodash';
import React, { Component } from 'react';
import * as config from '../config';
import { timings } from '../config';
import phrases from '../data/phrases';
import { playSound } from '../utils/sounds';
import CategoryLabel from './CategoryLabel';
import Dot from './Dot';
import GameBoard from './GameBoard';
import GlobalStyle from './GlobalStyle';
import Header from './Header';
import HeaderButton from './HeaderButton';
import HeaderSection from './HeaderSection';
import Icon from './Icon';
import NextButton from './NextButton';
import Phrase from './Phrase';
import PhraseCanvas from './PhraseCanvas';
import PointButtonForA from './PointButtonForA';
import PointButtonForB from './PointButtonForB';
import Pulse from './Pulse';
import ScoreDotsForA from './ScoreDotsForA';
import ScoreDotsForB from './ScoreDotsForB';
import Settings from './Settings';
import StartButton from './StartButton';
import ToggleButton from './ToggleButton';

class App extends Component {
  initialState = {
    phrase: '...loading...',
    phrasesSeen: [],
    activeRouteName: 'home',
    isFactoryResetting: false,
    isTransitioning: false,
    isNextButtonFrozen: false,
    lastTickTime: Date.now(),
    points: {
      A: 0,
      B: 0
    },
    lists: config.DEFAULT_LISTS,
    isRotated: false
  };

  constructor(props) {
    super(props);

    this.state = Object.assign({}, this.initialState);

    Object.assign(
      this.state,
      JSON.parse(window.localStorage.getItem('gameState')) || {}
    );

    this.loadPhrases();
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state !== prevState) {
      window.localStorage.setItem('gameState', JSON.stringify(this.state));
    }
  };

  loadPhrases = () => {
    this.phrases = [];

    Object.keys(this.state.lists).forEach(listName => {
      if (this.state.lists[listName]) {
        this.phrases = this.phrases.concat(phrases[listName]);
      }
    });

    this.phrases = this.phrases.filter(phrase => {
      return this.state.phrasesSeen.includes(phrase) === false;
    });

    this.phrases = shuffle(this.phrases);
  };

  toggleSelectedList = listName => {
    this.setState(
      state => ({
        lists: {
          ...state.lists,
          [listName]: !state.lists[listName]
        }
      }),
      this.loadPhrases
    );
  };

  toggleScreenRotation = () => {
    this.setState(state => ({
      isRotated: !state.isRotated
    }));
  };

  tick = () => {
    playSound('tick');
    this.setState({
      lastTickTime: Date.now()
    });
  };

  startRound = () => {
    const roundTimeLimit = random(config.MIN_ROUND_TIME, config.MAX_ROUND_TIME);
    this.stopRoundTimeout = setTimeout(this.stopRound, roundTimeLimit);

    this.tickerInterval = setInterval(() => {
      this.tick();
    }, 1000);

    const rushDuration = random(
      config.MIN_RUSH_DURATION,
      config.MAX_RUSH_DURATION
    );
    this.rushTimeout = setTimeout(() => {
      this.tickerInterval = clearInterval(this.tickerInterval);
      this.tickerInterval = setInterval(() => {
        this.tick();
      }, 250);
    }, roundTimeLimit - rushDuration);

    this.nextPhrase();

    this.transitionToRoute('in-game');
  };

  resetPhraseList = () => {
    this.setState(
      {
        phrasesSeen: [],
        isFactoryResetting: false
      },
      () => {
        this.loadPhrases();
        this.nextPhrase();
      }
    );
  };

  factoryReset = () => {
    this.setState({
      isFactoryResetting: true
    });

    setTimeout(() => {
      this.setState(this.initialState, () => {
        this.transitionToRoute('home');
      });
    }, 750);
  };

  nextPhrase = () => {
    const newPhrase = this.phrases.shift();

    if (this.phrases.length === 0) {
      this.resetPhraseList();

      return;
    }

    this.setState(state => {
      const newState = {
        isNextButtonFrozen: true,
        phrase: newPhrase,
        phrasesSeen: state.phrasesSeen.concat(state.phrase)
      };

      setTimeout(
        () =>
          this.setState({
            isNextButtonFrozen: false
          }),
        config.NEXT_BUTTON_FREEZE_TIME
      );

      return newState;
    });
  };

  abortRound = () => {
    this.tickerInterval = clearInterval(this.tickerInterval);
    this.stopRoundTimeout = clearInterval(this.stopRoundTimeout);
    this.rushTimeout = clearInterval(this.rushTimeout);
    this.transitionToRoute('home');
  };

  stopRound = () => {
    this.abortRound();
    playSound('beep');
  };

  addPoint = (teamName, delta) => {
    this.setState(
      state => ({
        points: {
          ...state.points,
          [teamName]: state.points[teamName] + delta
        }
      }),
      this.checkScore
    );
  };

  checkScore = () => {
    const {
      points: { A: pointsForA, B: pointsForB }
    } = this.state;

    if ([pointsForA, pointsForB].find(score => score >= config.MAX_SCORE)) {
      this.setState({
        points: {
          A: 0,
          B: 0
        }
      });
      playSound('celebration');
    }
  };

  transitionToRoute = routeName => {
    this.setState({
      activeRouteName: routeName,
      isTransitioning: true
    });
    setTimeout(() => {
      this.setState({
        isTransitioning: false
      });
    }, timings.duration);
  };

  routeIsActive = routeName => {
    return (
      this.state.activeRouteName === routeName && !this.state.isTransitioning
    );
  };

  render() {
    const {
      points: { A: pointsForA, B: pointsForB },
      lists,
      phrase,
      lastTickTime,
      isRotated,
      isNextButtonFrozen,
      isFactoryResetting
    } = this.state;

    return (
      <GameBoard isRotated={isRotated}>
        <GlobalStyle />
        <Header>
          <ScoreDotsForA isVisible={!this.routeIsActive('settings')}>
            {times(config.MAX_SCORE, index => (
              <Dot isActive={index < pointsForA} key={index} />
            ))}
          </ScoreDotsForA>
          <HeaderSection style={{ width: '12vw' }}>
            <HeaderButton
              isVisible={this.routeIsActive('home')}
              onTap={e => {
                this.transitionToRoute('settings');
              }}
            >
              <Icon>&#xf013;</Icon>
            </HeaderButton>
            <HeaderButton
              isVisible={this.routeIsActive('in-game')}
              onTap={this.abortRound}
            >
              <Icon>&#xf28d;</Icon>
            </HeaderButton>
            <HeaderButton
              isVisible={this.routeIsActive('settings')}
              onTap={e => {
                this.transitionToRoute('home');
              }}
            >
              <Icon>&#xf359;</Icon>
            </HeaderButton>
          </HeaderSection>
          <ScoreDotsForB
            isVisible={!this.routeIsActive('settings')}
            reversed={true}
          >
            {times(config.MAX_SCORE, index => (
              <Dot isActive={index < pointsForB} key={index} />
            ))}
          </ScoreDotsForB>
        </Header>
        <PointButtonForA
          isVisible={this.routeIsActive('home')}
          onTap={e => this.addPoint('A', 1)}
          onLongPress={e => this.addPoint('A', -1)}
        >
          A
        </PointButtonForA>
        <PointButtonForB
          isVisible={this.routeIsActive('home')}
          onTap={e => this.addPoint('B', 1)}
          onLongPress={e => this.addPoint('B', -1)}
        >
          B
        </PointButtonForB>
        <StartButton
          isVisible={this.routeIsActive('home')}
          onTap={this.startRound}
        >
          START
        </StartButton>
        <NextButton
          isVisible={this.routeIsActive('in-game')}
          isFrozen={isNextButtonFrozen}
          onTap={this.nextPhrase}
        >
          NEXT
        </NextButton>
        <PhraseCanvas isVisible={this.routeIsActive('in-game')}>
          <Phrase key={phrase}>
            <Pulse key={lastTickTime}>{phrase}</Pulse>
          </Phrase>
        </PhraseCanvas>
        <Settings isVisible={this.routeIsActive('settings')}>
          <CategoryLabel>Show Phrases From...</CategoryLabel>
          {Object.keys(lists)
            .sort()
            .map(category => (
              <ToggleButton
                key={category}
                isActive={lists[category]}
                onTap={() => this.toggleSelectedList(category)}
              >
                {category}
              </ToggleButton>
            ))}

          <CategoryLabel>Speakers on bottom?</CategoryLabel>
          <ToggleButton isActive={isRotated} onTap={this.toggleScreenRotation}>
            Rotate Screen
          </ToggleButton>

          <CategoryLabel>Advanced!</CategoryLabel>
          <ToggleButton isActive={isFactoryResetting} onTap={this.factoryReset}>
            Factory Reset?
          </ToggleButton>
        </Settings>
      </GameBoard>
    );
  }
}

export default App;
