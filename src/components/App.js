import React, { Component } from 'react';
import * as config from '../config';
// import { playSound } from '../utils/sounds';
import { shuffle, reduce } from 'lodash';
import phrases from '../data/phrases';
import GridLayout, { GridArea } from './GridLayout';
import { DESIGN_TOKENS } from '../config';
import { createGlobalStyle } from 'styled-components';
import Button from './Button';

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
      settings: {
        selectedLists: config.DEFAULT_LISTS,
        rotateScreen: false
      }
    };

    // Load state from localstorage
    Object.assign(
      this.state,
      JSON.parse(window.localStorage.getItem('gameState')) || {}
    );

    // Remove phrasesSeen from phrases
    this.state.phrases = this.state.phrases.filter(phrase => {
      return this.state.phrasesSeen.includes(phrase) === false;
    });

    console.log(this.state);
  }

  setGameState(newState) {
    this.setState(newState, () => {
      window.localStorage.setItem('gameState', JSON.stringify(this.state));
    });
  }

  render() {
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
          <GridArea snapTo="header">
            I'm in the header!
          </GridArea>
          <Button inflated={true} snapTo="leftbutton">A</Button>
          <Button inflated={true} snapTo="rightbutton">B</Button>
          <Button inflated={true} snapTo="startbutton">Start</Button>
        </GridLayout>
      </React.Fragment>
    );
  }
}

export default App;
