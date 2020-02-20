import { RECEIVE_TRANSACTIONS } from '../actions/transaction_actions';
import { LOGOUT_CURRENT_USER } from '../actions/session_actions';
import { merge } from 'lodash';

const transactionsReducer = (state = {}, action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_TRANSACTIONS:
      return merge({}, action.transactions);
    case LOGOUT_CURRENT_USER:
      return {};
    default:
      return state;
  }
};

export default transactionsReducer;