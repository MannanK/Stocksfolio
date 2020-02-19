import React from 'react';
import { connect } from 'react-redux';
import { getTickerInfo } from '../../util/iex_api_util';

class Portfolio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tickerSymbol : "",
      qty : -1
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearForm = this.clearForm.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    const { tickerSymbol } = this.state;

    getTickerInfo(tickerSymbol).then(res => {
      console.log(res);
    });
  }

  handleChange(value) {
    return e => {
      this.setState({
        [value]: e.target.value
      });
    };
  }

  clearForm() {
    this.setState({
      tickerSymbol: "",
      qty: -1
    });
  }

  render() {
    const { currentUser } = this.props;
    const { tickerSymbol, qty } = this.state;

    let convertToCurrency = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return (
      <>
        <header className="portfolio-header">
          <span className="portfolio-title">
            Portfolio
            {/* Portfolio (
            <span className="portfolio-balance">
              ${currentUser.balance}
            </span>
            ) */}
          </span>
        </header>

        <div className="portfolio-main-container">
          <section className="portfolio-left">
            {/* stocks-container */}
            Stocks section
          </section>

          <section className="portfolio-right">
            <div className="make-purchases-container">
              <span className="portfolio-balance-container">
                Cash - <span className="portfolio-balance">{convertToCurrency.format(currentUser.balance)}</span>
              </span>

              <form className="make-purchases-form" onSubmit={this.handleSubmit}>
                <input
                  type="text"
                  className="make-purchases-form-input"
                  value={tickerSymbol}
                  onChange={this.handleChange("tickerSymbol")}
                  placeholder="Ticker"
                />

                <input
                  type="number"
                  className="make-purchases-form-input"
                  value={(qty === -1 || qty === "0") ? "" : qty}
                  onChange={this.handleChange("qty")}
                  placeholder="Qty"
                />

                <button className="make-purchases-form-submit">Buy</button>
              </form>
            </div>
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