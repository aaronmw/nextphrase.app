import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from "styled-components";
import App from './components/App';
import './index.css';

const THEME = {
  primary: '#113347',
  secondary: 'LightSkyBlue',
  highlight: 'red',
};

ReactDOM.render(
  <ThemeProvider theme={THEME}>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);
