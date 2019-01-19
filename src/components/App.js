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
  constructor(props) {
    super(props);

    this.state = {
      phrase: '...loading...',
      phrasesSeen: [],
      activeRouteName: 'home',
      isTransitioning: false,
      lastTickTime: Date.now(),
      points: {
        A: 0,
        B: 0
      },
      lists: config.DEFAULT_LISTS,
      isRotated: false
    };

    // Load state from localStorage
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
    // Smoosh the phrases from the lists we want to see
    this.phrases = [];
    Object.keys(this.state.lists).forEach(listName => {
      if (this.state.lists[listName]) {
        this.phrases = this.phrases.concat(phrases[listName]);
      }
    });

    // Remove phrasesSeen from phrases
    this.phrases = this.phrases.filter(phrase => {
      return this.state.phrasesSeen.includes(phrase) === false;
    });

    // Shuffle whatever phrases are left
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
    console.log(this.state);
  };

  tick = () => {
    playSound('tick');
    this.setState({
      lastTickTime: Date.now()
    });
  };

  startRound = () => {
    // Stop all of this at the end of the round
    const roundTimeLimit = random(config.MIN_ROUND_TIME, config.MAX_ROUND_TIME);
    this.stopRoundTimeout = setTimeout(this.stopRound, roundTimeLimit);

    // Start ticking
    this.tickerInterval = setInterval(() => {
      this.tick();
    }, 1000);

    // Tick faster near the end
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

    // Advance to the next phrase
    this.nextPhrase();

    // Show the game screen
    this.transitionToRoute('in-game');
  };

  nextPhrase = () => {
    this.setState(state => ({
      phrase: this.phrases.shift(),
      phrasesSeen: state.phrasesSeen.concat(state.phrase)
    }));
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
      isRotated
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
          <CategoryLabel>
            Show Phrases From...
          </CategoryLabel>
          {Object.keys(lists)
            .sort()
            .map(category => (
              <ToggleButton
                key={category}
                isActive={lists[category]}
                onTap={e => this.toggleSelectedList(category)}
              >
                {category}
              </ToggleButton>
            ))}
          <CategoryLabel>
            Speakers on bottom?
          </CategoryLabel>
          <ToggleButton
            isActive={isRotated}
            onTap={e => this.toggleScreenRotation()}
          >
            Rotate Screen
          </ToggleButton>
        </Settings>
      </GameBoard>
    );
  }
}

export default App;
