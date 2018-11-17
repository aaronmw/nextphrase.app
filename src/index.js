import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import App from './components/App';
import './index.css';

const THEME = {
  borderWidth: '8px',
  halfBorderWidth: '4px',
  primary: '#000000',
  secondary: 'white',
  highlight: 'rgba(255, 255, 255, 0.5)',
  frozenOpacity: 0.1
};

document.body.addEventListener('touchmove', function(e) {
  e.preventDefault();
});

ReactDOM.render(
  <ThemeProvider theme={THEME}>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
);
