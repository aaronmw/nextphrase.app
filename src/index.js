import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

document.body.addEventListener('touchmove', function(e) {
  e.preventDefault();
});

ReactDOM.render(<App />, document.getElementById('root'));
