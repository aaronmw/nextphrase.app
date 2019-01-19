import { createGlobalStyle } from 'styled-components';
import { colors } from '../config';

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
    line-height: 42px;
    font-family: 'Boogaloo', sans-serif;
    text-transform: uppercase;
    background-color: ${colors.background};
  }

  body {
    background-color: ${colors.foreground};
    color: ${colors.foreground};
    position: absolute;
    height: 100vh;
    width: 100vw;
    overflow: hidden;

    &:before,
    &:after {
      content: '';
      position: fixed;
      width: 100vw;
      background-color: ${colors.background};
      z-index: 100;
    }
    &:before {
      height: calc(env(safe-area-inset-top));
      top: 0;
    }
    &:after {
      height: calc(env(safe-area-inset-bottom));
      bottom: 0;
    }
  }
`;

export default GlobalStyle;
