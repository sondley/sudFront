import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './redux/reducers';
import middleware from './redux/middleware';
import App from './App';

//Styles
import 'semantic-ui-css/semantic.min.css';
import './index.css';

const store = createStore(reducer, middleware);

ReactDOM.render((
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
), document.getElementById('root'));