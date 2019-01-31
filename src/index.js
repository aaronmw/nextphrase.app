import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

// document.body.addEventListener('touchmove', function(e) {
//   e.preventDefault();
// });
// document.body.addEventListener('touchend', function(e) {
//   e.preventDefault();
// });

window.oncontextmenu = function() { return false; }

ReactDOM.render(<App />, document.getElementById('root'));
