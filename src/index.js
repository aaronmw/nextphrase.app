import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from "styled-components";
import App from './components/App';
import './index.css';

const THEME = {
  borderWidth: '8px',
  halfBorderWidth: '4px',
  primary: '#2864A5',
  secondary: 'white',
  highlight: 'rgba(255,255,255,0.2)',
};

document.addEventListener('touchmove', function (e) {
  e.preventDefault();
});

ReactDOM.render(
  <ThemeProvider theme={THEME}>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);
