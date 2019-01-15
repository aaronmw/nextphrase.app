import { createGlobalStyle } from 'styled-components';
import { DESIGN_TOKENS } from '../config';

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
    background-color: ${DESIGN_TOKENS.colors.background};
  }

  body {
    background-color: ${DESIGN_TOKENS.colors.foreground};
    color: ${DESIGN_TOKENS.colors.foreground};
    overflow: hidden;
    position: fixed;
    height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
    top: env(safe-area-inset-top);
    bottom: env(safe-area-inset-bottom);
    width: 100vw;
  }
`;

export default GlobalStyle;
