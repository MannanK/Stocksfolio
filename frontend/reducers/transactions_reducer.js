import { RECEIVE_TRANSACTIONS } from '../actions/transaction_actions';
import { merge } from 'lodash';

const transactionsReducer = (state = {}, action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_TRANSACTIONS:
      return merge({}, action.transactions);
    default:
      return state;
  }
};

export default transactionsReducer;