import {
  RECEIVE_CURRENT_USER,
  LOGOUT_CURRENT_USER
} from '../actions/session_actions';
import { RECEIVE_STOCK } from '../actions/stock_actions';
import { merge } from 'lodash';

const usersReducer = (state = {}, action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      // currently, since there will only ever be a single user in our slice of
        // state, we simply overwrite the previous object with the new one that
        // was returned; set the ID of the user as the object key
      // however, with the current setup, multiple users can exist in the slice
        // of state, if needed in the future
      return merge({}, { [action.user.id]: action.user });
    case RECEIVE_STOCK:
      // whenever the user makes a new transaction, our stocks and transactions
        // will be updated
      // because of this, we need to update our users slice of slice every time
      return merge({}, state, { [action.data.user.id]: action.data.user });
    case LOGOUT_CURRENT_USER:
      return {};
    default:
      return state;
  }
};

export default usersReducer;