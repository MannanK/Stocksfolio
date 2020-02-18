import {
  RECEIVE_SESSION_ERRORS,
  RECEIVE_CURRENT_USER,
  DELETE_SESSION_ERRORS
} from "../actions/session_actions";

const sessionErrorsReducer = (state = [], action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_SESSION_ERRORS:
      // whenever we receive new session errors, simply overwrite the old
        // session errors with the new ones
      // the errors we receive come in an array
      return action.errors;
    case RECEIVE_CURRENT_USER:
      return [];
    case DELETE_SESSION_ERRORS:
      return [];
    default:
      return state;
  }
};

export default sessionErrorsReducer;