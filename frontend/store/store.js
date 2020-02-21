import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers/root_reducer';
import thunk from 'redux-thunk';

const middlewares = [thunk];
if (process.env.NODE_ENV !== "production") {
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

// configureStore will return a new store with the rootReducer and
  // preloadedState (if any) passed in
// thunk is a middleware we need for future AJAX calls and other async
  //redux actions, and logger is for debugging purposes
const configureStore = (preloadedState = {}) => (
  createStore(rootReducer, preloadedState, applyMiddleware(...middlewares))
);

export default configureStore;