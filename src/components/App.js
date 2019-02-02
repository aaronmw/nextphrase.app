import {
  filter,
  omit,
  random,
  shuffle,
  startCase,
  times
} from 'lodash';
import React, { Component } from 'react';
import * as config from '../config';
import { colors, timings } from '../config';
import phrases from '../data/phrases';
import { playSound } from '../utils/sounds';
import ButtonMention from './ButtonMention';
import Dot from './Dot';
import GameBoard from './GameBoard';
import GlobalStyle from './GlobalStyle';
import Header from './Header';
import HeaderButton from './HeaderButton';
import HeaderSection from './HeaderSection';
import HowToPlay from './HowToPlay';
import Icon from './Icon';
import LoadingScreen from './LoadingScreen';
import Logo from './Logo';
import NewGameButton from './NewGameButton';
import NextButton from './NextButton';
import NoWrap from './NoWrap';
import Phrase from './Phrase';
import PhraseCanvas from './PhraseCanvas';
import PointButtonForA from './PointButtonForA';
import PointButtonForB from './PointButtonForB';
import Pulse from './Pulse';
import RotationWarning from './RotationWarning';
import ScoreDotsForA from './ScoreDotsForA';
import ScoreDotsForB from './ScoreDotsForB';
import Section from './Section';
import SectionTitle from './SectionTitle';
import SectionContent from './SectionContent';
import Settings from './Settings';
import SettingsButton from './SettingsButton';
import StartButton from './StartButton';
import ToggleButton from './ToggleButton';

class App extends Component {
  initialState = {
    phrase: '...loading...',
    orientation: 'normal',
    phrasesSeen: [],
    previousRouteName: '',
    activeRouteName: 'loading',
    isFactoryResetting: false,
    isRushing: false,
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

    const savedState =
      JSON.parse(window.localStorage.getItem('gameState')) || {};

    this.state = Object.assign({}, this.initialState, savedState);

    this.state.lists = Object.assign(
      {},
      this.initialState.lists,
      savedState.lists
    );

    if (this.state.points.A + this.state.points.B === 0) {
      this.state.activeRouteName = 'loading';
    }

    this.loadPhrases();
  }

  updateWindowOrientation = () => {
    let orientation = 'normal';
    if (window.orientation === -90) {
      orientation = 'right';
    }
    if (window.orientation === 90) {
      orientation = 'left';
    }
    if (window.orientation === 0) {
      orientation = 'normal';
    }

    this.setState({ orientation: orientation });
  };

  componentDidMount = () => {
    window.addEventListener(
      'orientationchange',
      this.updateWindowOrientation,
      true
    );
    this.updateWindowOrientation();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state !== prevState) {
      const persistedState = omit(this.state, [
        'isTransitioning',
        'orientation'
      ]);

      window.localStorage.setItem(
        'gameState',
        JSON.stringify(persistedState, null, '\t')
      );
    }
  };

  loadPhrases = () => {
    this.phrases = [];

    Object.keys(this.state.lists).forEach(listName => {
      if (this.state.lists[listName] === true) {
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

    this.rushTimeout = setTimeout(this.rush, roundTimeLimit - rushDuration);

    this.nextPhrase();

    this.transitionToRoute('in-game');
  };

  rush = () => {
    this.setState({
      isRushing: true
    });
    this.tickerInterval = clearInterval(this.tickerInterval);
    this.tickerInterval = setInterval(() => {
      this.tick();
    }, 250);
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
        this.transitionToRoute('loading');
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
    this.setState({
      isRushing: false
    });
    this.transitionToRoute('home');
  };

  stopRound = () => {
    this.abortRound();
    playSound('buzz');
    this.transitionToRoute('post-round');
  };

  addPoint = (teamName, delta) => {
    this.setState(
      state => ({
        points: {
          ...state.points,
          [teamName]: Math.max(0, state.points[teamName] + delta)
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
      this.transitionToRoute('loading');
    } else {
      this.transitionToRoute('home');
    }
  };

  transitionToRoute = routeName => {
    this.setState({
      previousRouteName: this.state.activeRouteName,
      activeRouteName: routeName,
      isTransitioning: true
    });
    setTimeout(() => {
      this.setState({
        isTransitioning: false
      });
    }, timings.duration);
  };

  activeRouteIs = routeName => {
    routeName = Array.isArray(routeName) ? routeName : [routeName];
    const routeIsActive = routeName.indexOf(this.state.activeRouteName) !== -1;
    const skipTransition =
      routeIsActive && routeName.indexOf(this.state.previousRouteName) !== -1;
    return skipTransition
      ? routeIsActive
      : routeIsActive && !this.state.isTransitioning;
  };

  render() {
    const {
      points: { A: pointsForA, B: pointsForB },
      lists,
      phrase,
      lastTickTime,
      isRotated,
      isRushing,
      isNextButtonFrozen,
      isFactoryResetting,
      orientation
    } = this.state;

    return (
      <GameBoard isRotated={isRotated}>
        <GlobalStyle />
        <RotationWarning orientation={orientation} />
        <Header
          isRushing={isRushing}
          isFrozen={this.activeRouteIs('post-round')}
        >
          <ScoreDotsForA
            isVisible={this.activeRouteIs(['home', 'in-game', 'post-round'])}
            reversed={true}
          >
            {times(config.MAX_SCORE, index => (
              <Dot isActive={index < pointsForA} key={index} />
            ))}
          </ScoreDotsForA>
          <HeaderSection style={{ width: '12vw' }}>
            <HeaderButton
              isVisible={this.activeRouteIs('loading')}
              onTap={() => this.transitionToRoute('how-to-play-via-loading')}
            >
              HOW&nbsp;TO&nbsp;PLAY
            </HeaderButton>
            <HeaderButton
              isVisible={this.activeRouteIs('home')}
              onTap={() => this.transitionToRoute('settings')}
            >
              <Icon>&#xf013;</Icon>
            </HeaderButton>
            <HeaderButton
              isVisible={this.activeRouteIs('in-game')}
              onTap={this.abortRound}
            >
              <Icon>&#xf28d;</Icon>
            </HeaderButton>
            <HeaderButton
              isVisible={this.activeRouteIs('settings')}
              isFrozen={filter(lists, list => list).length === 0}
              onTap={() => this.transitionToRoute('home')}
            >
              <Icon>&#xf359;</Icon>
            </HeaderButton>
            <HeaderButton
              isVisible={this.activeRouteIs('how-to-play-via-loading')}
              onTap={() => this.transitionToRoute('loading')}
            >
              <Icon>&#xf359;</Icon>
            </HeaderButton>
            <HeaderButton
              isVisible={this.activeRouteIs('how-to-play-via-settings')}
              onTap={() => this.transitionToRoute('settings')}
            >
              <Icon>&#xf359;</Icon>
            </HeaderButton>
          </HeaderSection>
          <ScoreDotsForB
            isVisible={this.activeRouteIs(['home', 'in-game', 'post-round'])}
          >
            {times(config.MAX_SCORE, index => (
              <Dot isActive={index < pointsForB} key={index} />
            ))}
          </ScoreDotsForB>
        </Header>
        <LoadingScreen isVisible={this.activeRouteIs('loading')}>
          <Logo />
        </LoadingScreen>
        <NewGameButton
          isVisible={this.activeRouteIs('loading')}
          onTap={() => this.transitionToRoute('home')}
        >
          New Game
        </NewGameButton>
        <PointButtonForA
          isVisible={this.activeRouteIs(['home', 'post-round'])}
          onTap={() => this.addPoint('A', 1)}
          onLongPress={() => this.addPoint('A', -1)}
        >
          A
        </PointButtonForA>
        <PointButtonForB
          isVisible={this.activeRouteIs(['home', 'post-round'])}
          onTap={() => this.addPoint('B', 1)}
          onLongPress={() => this.addPoint('B', -1)}
        >
          B
        </PointButtonForB>
        <StartButton
          isVisible={this.activeRouteIs(['home', 'post-round'])}
          isFrozen={this.activeRouteIs('post-round')}
          onTap={this.startRound}
        >
          START
        </StartButton>
        <NextButton
          isVisible={this.activeRouteIs('in-game')}
          isFrozen={isNextButtonFrozen}
          isRushing={isRushing}
          onTap={this.nextPhrase}
        >
          NEXT
        </NextButton>
        <PhraseCanvas
          isVisible={this.activeRouteIs('in-game')}
          isRushing={isRushing}
        >
          <Phrase key={phrase}>
            <Pulse key={lastTickTime}>{phrase}</Pulse>
          </Phrase>
        </PhraseCanvas>
        <Settings isVisible={this.activeRouteIs('settings')}>
          <Section>
            <SectionTitle>Phrase Collections</SectionTitle>
            <SectionContent>
              {Object.keys(lists)
                .sort()
                .map(category => (
                  <ToggleButton
                    key={category}
                    isActive={lists[category]}
                    onTap={() => this.toggleSelectedList(category)}
                  >
                    {startCase(category)}
                  </ToggleButton>
                ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Not loud enough?</SectionTitle>
            <SectionContent>
              <ToggleButton
                isActive={isRotated}
                onTap={this.toggleScreenRotation}
              >
                Rotate Speakers to Top
              </ToggleButton>
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Help, I'm a newbie!</SectionTitle>
            <SectionContent>
              <SettingsButton
                onTap={() => this.transitionToRoute('how-to-play-via-settings')}
              >
                Instructions
              </SettingsButton>
            </SectionContent>
          </Section>

          {config.DEBUG_MODE && (
            <Section>
              <SectionTitle>Advanced!</SectionTitle>
              <SectionContent>
                <ToggleButton
                  isActive={isFactoryResetting}
                  onTap={this.factoryReset}
                >
                  Factory Reset?
                </ToggleButton>
              </SectionContent>
            </Section>
          )}
        </Settings>
        <HowToPlay
          isVisible={this.activeRouteIs([
            'how-to-play-via-settings',
            'how-to-play-via-loading'
          ])}
        >
          <Section>
            <SectionTitle>How to Play</SectionTitle>
            <SectionContent>
              <p>
                An even number of players (4 or more) stand in{' '}
                <NoWrap>a circle.</NoWrap>
              </p>

              <p>
                <ButtonMention bg={colors.teamA} fg={colors.foreground}>
                  Team A
                </ButtonMention>{' '}
                starts with you, then&mdash;moving around the cirle&mdash;
                <ButtonMention bg={colors.teamB} fg={colors.foreground}>
                  Team B
                </ButtonMention>
                , and so on. Remember <NoWrap>your teams!</NoWrap>
              </p>

              <p>
                Press{' '}
                <ButtonMention fg={colors.background} bg={colors.foreground}>
                  START
                </ButtonMention>{' '}
                to begin a round and get your first phrase. Get your team to say
                it without saying any part of the words, nor rhyming. Once
                they've repeated the phrase on screen, pass it to the{' '}
                <NoWrap>next player.</NoWrap>
              </p>

              <p>
                You'll have between {config.MIN_ROUND_TIME / 1000} and{' '}
                {config.MAX_ROUND_TIME / 1000} seconds before the buzzer. You
                can press{' '}
                <ButtonMention fg={colors.background} bg={colors.foreground}>
                  NEXT
                </ButtonMention>{' '}
                to receive another phrase, but it is generally frowned upon.
              </p>

              <p>
                Whomever is holding the game when the buzzer goes off must log
                the loss, then begin the next round.
              </p>
            </SectionContent>
          </Section>
        </HowToPlay>
      </GameBoard>
    );
  }
}

export default App;
