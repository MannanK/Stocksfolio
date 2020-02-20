import React from 'react';
import { connect } from 'react-redux';
import { fetchTransactions } from '../../actions/transaction_actions';

class Transactions extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchTransactions();
  }

  render() {
    return (
      <h1>Transactions</h1>
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