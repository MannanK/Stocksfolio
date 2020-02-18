import {
  RECEIVE_CURRENT_USER,
  LOGOUT_CURRENT_USER
} from '../actions/session_actions';
import { merge } from 'lodash';

// the default object this slice of state should be set to if no one is
  // currently logged in
const _nullSession = {
  currentUserId: null
};

const sessionReducer = (state = _nullSession, action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      // set currentUserId equal to the ID of the user that is currently
        // logged in
      return merge({}, { currentUserId: action.user.id });
    case LOGOUT_CURRENT_USER:
      // return the default object since no one is logged in
      return _nullSession;
    default:
      return state;
  }
}

export default sessionReducer;