import * as TransactionsAPIUtil from '../util/transactions_api_util';

export const RECEIVE_TRANSACTIONS = "RECEIVE_TRANSACTIONS";

const receiveTransactions = transactions => ({
  type: RECEIVE_TRANSACTIONS,
  transactions
});

export const fetchTransactions = () => dispatch => (
  TransactionsAPIUtil.fetchTransactions().then(
    transactions => dispatch(receiveTransactions(transactions))
  )
);