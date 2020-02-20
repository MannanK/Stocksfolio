import React from 'react';
import { connect } from 'react-redux';
import { getTickerInfo } from '../../util/iex_api_util';
import { fetchStocks, createTransaction } from '../../actions/stock_actions';

class Portfolio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tickerSymbol : "",
      qty : -1,
      tickerNotFound : false,
      lowBalance : false,
      submitButtonType : "BUY",
      latestPrice : null
    };

    this.handleBuy = this.handleBuy.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearForm = this.clearForm.bind(this);
  }

  componentDidMount() {
    this.props.fetchStocks();
  }

  handleBuy(e) {
    e.preventDefault();

    const { tickerSymbol } = this.state;

    getTickerInfo(tickerSymbol)
      .then(res => {
        this.setState({
          tickerNotFound : false,
          submitButtonType : "CONFIRM",
          latestPrice : res.latestPrice,
          lowBalance : false
        });
      })
      // not a valid ticker symbol
      .fail(res => {
        if (res.status === 404) {
          this.setState({
            tickerNotFound : true,
            submitButtonType : "BUY",
            lowBalance : false
          });
        }
      });
  }

  handleConfirm(e) {
    e.preventDefault();

    const { currentUser } = this.props;
    const { tickerSymbol, qty, latestPrice } = this.state;

    let purchasePrice = latestPrice * qty;
    let userBalance = parseFloat(currentUser.balance);

    // the user doesn't have enough cash to buy the shares
    if (purchasePrice > userBalance) {
      this.setState({
        tickerNotFound: false,
        lowBalance: true,
        submitButtonType : "BUY",
        latestPrice : null
      });
    }
    // the user has enough cash to buy the shares
    else {
      this.props.createTransaction({
        ticker_symbol: tickerSymbol.toUpperCase(),
        shares: qty,
        price_per_share: latestPrice
      });

      this.setState({
        tickerSymbol: "",
        qty: -1,
        tickerNotFound: false,
        lowBalance: false,
        submitButtonType : "BUY",
        latestPrice : null
      });
    }
  }

  handleChange(value) {
    return e => {
      this.setState({
        [value]: e.target.value,
        submitButtonType : "BUY"
      });
    };
  }

  clearForm() {
    this.setState({
      tickerSymbol: "",
      qty: -1,
      submitButtonType : "BUY"
    });
  }

  render() {
    const { currentUser, stocks } = this.props;
    const { tickerSymbol, qty, tickerNotFound, lowBalance, submitButtonType, latestPrice } = this.state;

    let convertToCurrency = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    let tickerNotFoundError = tickerNotFound ? (
      <p className="make-purchases-form-error">Please enter a valid ticker!</p>
    ) : "";

    let lowBalanceError = lowBalance ? (
      <p className="make-purchases-form-error">You don't have enough cash!</p>
    ) : "";

    let formAction;
    let buttonText;
    let confirmPurchaseMessage;

    if (submitButtonType === "BUY") {
      formAction = this.handleBuy;
      buttonText = "Buy";
      confirmPurchaseMessage = "";
    } else {
      formAction = this.handleConfirm;
      buttonText = "Confirm";
      confirmPurchaseMessage =
        <p className="confirm-purchase-message">
          Please confirm if you'd like to buy
          <span> {qty} </span>
          share(s) of
          <span> {tickerSymbol.toUpperCase()} </span>
          for
          <span> {convertToCurrency.format(latestPrice*qty)} </span>
          (
          <span style={{color : "blue"}}>{convertToCurrency.format(latestPrice)}/share</span>
          ).
        </p>
      ;
    }

    let stockRows = Object.values(stocks).reverse().map((stock, i) => {
      let sharesText = stock.shares > 1 ? "shares" : "share";
      
      return (
        <tr className="stocks-table-row" key={i}>
          <td className="stocks-table-data ticker-symbol">{stock.ticker_symbol}</td>
          <td className="stocks-table-data num-shares">{stock.shares} {sharesText}</td>
          <td className="stocks-table-data price">$2,000.00</td>
        </tr>
      );
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
            <div className="stocks-container">
              <table className="stocks-table">
                <tbody>
                  {stockRows}
                </tbody>
              </table>
            </div>
          </section>

          <section className="portfolio-right">
            <div className="make-purchases-container">
              <span className="portfolio-balance-container">
                Cash - <span className="portfolio-balance">{convertToCurrency.format(currentUser.balance)}</span>
              </span>

              { tickerNotFoundError }
              { lowBalanceError }
              { confirmPurchaseMessage }

              <form className="make-purchases-form" onSubmit={formAction}>
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

                <button className={`make-purchases-form-submit ${submitButtonType.toLowerCase()}`}>
                  {buttonText}
                </button>
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
  currentUser: state.entities.users[state.session.currentUserId],
  stocks: state.entities.stocks
});

const mdp = dispatch => ({
  fetchStocks: () => dispatch(fetchStocks()),
  createTransaction: transaction => dispatch(createTransaction(transaction))
});

export default connect(msp, mdp)(Portfolio);