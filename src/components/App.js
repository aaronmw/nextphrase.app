import React, { Component } from 'react';
import * as config from '../config';
import styled from 'styled-components';
import { playSound } from '../utils/sounds';
import { shuffle, reduce } from 'lodash';
import phrases from '../data/phrases';
import GridLayout, { GridArea } from './GridLayout';
import { DESIGN_TOKENS } from '../config';
import { createGlobalStyle } from 'styled-components';

/**
 * TODO:
 *
 * - add settings
 *
 */

const GlobalStyle = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    background: inherit;
    color: inherit;
    border: none;
    outline: none;
    list-style-type: none;
    font-weight: inherit;
    font-size: inherit;
    font-style: inherit;
    text-decoration: inherit;
    box-sizing: border-box;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  :root {
    font-size: 42px;
    line-height: 24px;
    font-family: 'Boogaloo', sans-serif;
    text-transform: uppercase;
  }

  body {
    background-color: ${DESIGN_TOKENS.colors.background};
    color: ${DESIGN_TOKENS.colors.foreground};
    overflow: hidden;
    position: fixed;
    height: 100vh;
    width: 100vw;
  }
`;

const Dot = styled.div`
  display: inline-block;
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 1000px;
  font-size: 0;
  line-height: 0;

  ${props => props.filled ? `
    background: ${DESIGN_TOKENS.colors.foreground};
  ` : `
    border: 2px solid ${DESIGN_TOKENS.colors.foreground};
  `}
`;

const GameHeader = styled(GridArea)`
  display: flex;
  width: 100%;
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phrases: reduce(
        phrases,
        (result, value) => {
          return result.concat(value);
        },
        []
      ),
      phrasesSeen: [],
      activeRouteName: 'start',
      points: {
        A: 0,
        B: 0
      },
      settings: {
        selectedLists: config.DEFAULT_LISTS,
        rotateScreen: false
      }
    };

    // Load state from localStorage
    Object.assign(
      this.state,
      JSON.parse(window.localStorage.getItem('gameState')) || {}
    );

    // Remove phrasesSeen from phrases
    this.state.phrases = this.state.phrases.filter(phrase => {
      return this.state.phrasesSeen.includes(phrase) === false;
    });

    // Shuffle whatever phrases are left
    this.state.phrases = shuffle(this.state.phrase);

    console.log(this.state);
  }

  setGameState(newState) {
    this.setState(newState, () => {
      window.localStorage.setItem('gameState', JSON.stringify(this.state));
      console.log(this.state);
    });
  }

  toggleScreenRotation = () => {
    this.setGameState({
      isRotated: !this.state.isRotated
    });
  }

  addPoint = (teamName, delta) => {
    this.setGameState({
      ...this.state,
      points: {
        ...this.state.points,
        [teamName]: this.state.points[teamName] + delta
      }
    });
  };

  render() {
    const {
      points: { A: pointsForA, B: pointsForB }
    } = this.state;

    return (
      <React.Fragment>
        <GlobalStyle />
        <GridLayout
          columns="1fr 1fr"
          rows="10vh 50vw auto"
          areas={`
            'header      header'
            'leftbutton  rightbutton'
            'startbutton startbutton'
          `}
        >
          <GameHeader snapTo="header">
            <div>
              {[...Array(7)].map((e, i) => <Dot filled={(i < pointsForA)} key={i} />)}
            </div>
            <div>
              S
            </div>
            <div>
              {[...Array(7)].map((e, i) => <Dot filled={(i < pointsForB)} key={i} />)}
            </div>
          </GameHeader>
          <GridArea
            snapTo="leftbutton"
            tapHandler={() => this.addPoint('A', 1)}
            longPressHandler={() => this.addPoint('A', -1)}
          >
            A
          </GridArea>
          <GridArea
            snapTo="rightbutton"
            tapHandler={() => this.addPoint('B', 1)}
            longPressHandler={() => this.addPoint('B', -1)}
          >
            B
          </GridArea>
          <GridArea snapTo="startbutton">Start</GridArea>
        </GridLayout>
      </React.Fragment>
    );
  }
}

export default App;
