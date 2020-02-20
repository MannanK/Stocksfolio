import * as TransactionsAPIUtil from '../util/transactions_api_util';
import * as StocksAPIUtil from '../util/stocks_api_util';

export const RECEIVE_STOCKS = "RECEIVE_STOCKS";
export const RECEIVE_STOCK = "RECEIVE_STOCK";
export const RECEIVE_TRANSACTION_ERROR = "RECEIVE_TRANSACTION_ERROR";
export const DELETE_TRANSACTION_ERROR = "DELETE_TRANSACTION_ERROR";

const receiveStocks = stocks => ({
  type: RECEIVE_STOCKS,
  stocks
});

const receiveStock = data => ({
  type: RECEIVE_STOCK,
  data
});

const receiveTransactionError = error => ({
  type: RECEIVE_TRANSACTION_ERROR,
  error
});

export const deleteTransactionError = () => ({
  type: DELETE_TRANSACTION_ERROR
});

export const fetchStocks = () => dispatch => (
  StocksAPIUtil.fetchStocks().then(
    stocks => dispatch(receiveStocks(stocks))
  )
);

export const createTransaction = transaction => dispatch => (
  TransactionsAPIUtil.createTransaction(transaction).then(
    data => dispatch(receiveStock(data)),
    res => dispatch(receiveTransactionError(res.responseJSON))
  )
);