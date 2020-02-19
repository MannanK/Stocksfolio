import React from 'react';
import { connect } from 'react-redux';

class Portfolio extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { currentUser } = this.props;

    return (
      <>
        <header className="portfolio-header">
          <span className="portfolio-title">
            Portfolio (
          <span className="portfolio-balance">
              ${currentUser.balance}
            </span>
            )
        </span>
        </header>

        <div className="portfolio-main-container">
          <section className="stocks">
            Stocks section
          </section>

          <section className="make-purchases">
            Make purchases section
          </section>
        </div>
      </>
    );
  }
}

const msp = state => ({
  // map the info of the currentUser from the users slice of state
  currentUser: state.entities.users[state.session.currentUserId]
});

const mdp = dispatch => ({
  
});

export default connect(msp, mdp)(Portfolio);