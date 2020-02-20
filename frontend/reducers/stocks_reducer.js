import {
  RECEIVE_STOCKS, RECEIVE_STOCK
} from '../actions/stock_actions';
import { merge } from 'lodash';

const stocksReducer = (state = {}, action) => {
  Object.freeze(state);

  switch (action.type) {
    case RECEIVE_STOCKS:
      debugger;
      return merge({}, action.stocks);
    case RECEIVE_STOCK:
      return merge({}, state, { [action.data.stock.id]: action.data.stock });
    default:
      return state;
  }
};

export default stocksReducer;