import React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { fetchTransactions } from '../../actions/transaction_actions';

class Transactions extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchTransactions();
  }

  render() {
    const { transactions } = this.props;

    let convertToCurrency = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    let transactionsEl;

    if (isEmpty(transactions)) {
      transactionsEl =
        <p className="empty-message">
          You haven't made any transactions! Feel free to buy some stocks on the Portfolio page.
        </p>;
    } else {
      let transactionRows = Object.values(transactions).reverse().map((transaction, i) => {
        let sharesText = transaction.shares > 1 ? "shares" : "share";

        return (
          <tr className="transactions-table-row" key={i}>
            <td className="transactions-table-data type">BUY</td>
            <td className="transactions-table-data ticker-symbol">{transaction.ticker_symbol}</td>
            <td className="transactions-table-data num-shares">{transaction.shares} {sharesText}</td>
            <td className="transactions-table-data price">
              {convertToCurrency.format(transaction.price_per_share)}
              <span>/share</span>
            </td>
          </tr>
        );
      });

      transactionsEl =
        <table className="transactions-table">
          <tbody>
            {transactionRows}
          </tbody>
        </table>;
    }

    return (
      <>
        <header className="page-header">Transactions</header>
        <div className="transactions-outer-container">
          <div className="transactions-container">
            {transactionsEl}
          </div>
        </div>
      </>
    );
  }
}

const msp = state => ({
  // map the info of the currentUser from the users slice of state
  currentUser: state.entities.users[state.session.currentUserId],
  transactions: state.entities.transactions
});

const mdp = dispatch => ({
  fetchTransactions: () => dispatch(fetchTransactions())
});

export default connect(msp, mdp)(Transactions);