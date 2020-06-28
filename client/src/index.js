import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore,  applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import './index.css';
import App from './App';
import reducer from './store/reducer';

const composeEnhancers = process.env.NODE_ENV === 'development'
? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
: null;

const store = createStore(reducer,composeEnhancers(applyMiddleware(thunk)));

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)

ReactDOM.render(app, document.getElementById('root'));
