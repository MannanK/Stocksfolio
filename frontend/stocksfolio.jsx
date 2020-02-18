import React from "react";
import ReactDOM from "react-dom";
import Root from './components/root';
import configureStore from './store/store';

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");

  let store;

  // bootstrapping the user
  // check if a user is already logged in and on the window (done in the backend)
  if (window.currentUser) {
    // preload the state with the user's data and put it in the users slice
      // of state and the ID in the session slice of state
    const preloadedState = {
      entities: { users: { [window.currentUser.id]: window.currentUser } },
      session: { currentUserId: window.currentUser.id }
    };

    store = configureStore(preloadedState);

    // remove the currentUser object from the window
    delete window.currentUser;
  } else {
    store = configureStore();
  }

  // TODO : for testing only
  window.getState = store.getState;
  window.dispatch = store.dispatch;

  ReactDOM.render(<Root store={store} />, root);
});