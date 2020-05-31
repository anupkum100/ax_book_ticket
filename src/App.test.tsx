import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');

  fetch('http://localhost:8080/db')
    .then(() => ReactDOM.render(<App />, div))
    .catch((err) => console.log('Error!!!!' + err));
});
