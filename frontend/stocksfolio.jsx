import React from "react";
import ReactDOM from "react-dom";

// TODO : for testing only
import configureStore from './store/store';

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  ReactDOM.render(<h1>Welcome to Stocksfolio</h1>, root);

  const store = configureStore();

  // TODO : for testing only
  window.getState = store.getState;
  window.dispatch = store.dispatch;
});