import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import authReducer from './store/reducers/auth';
import scheduleReducer from './store/reducers/schedule';

// the firebase base url
axios.defaults.baseURL = 'https://react-calendar-e4845.firebaseio.com';

// we set the logger to help us with logging on console the actions and data sent to reducer
const logger = store => {
  return next => {
      return action => {
          console.log('[Middleware] Dispatching', action);
          const result = next(action);
          console.log('[Middleware] next state', store.getState());
          return result;
      }
  }
};

// combine the two reducers
const rootReducer = combineReducers({
  auth: authReducer,
  schedule: scheduleReducer
});

// add the chrome plugin to have an easy overview of redux
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// combine all we use in store as well as thnk for asychronous operations
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(logger, thunk)));

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
