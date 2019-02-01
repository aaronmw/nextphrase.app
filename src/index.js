import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

window.oncontextmenu = function() {
  return false;
};

ReactDOM.render(<App />, document.getElementById('root'));
