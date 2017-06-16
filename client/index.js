import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Form from './Components/Form';

const App = () => {
  return (
    <div className="container">
      <Form />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
