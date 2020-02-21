import React from 'react';
import { connect } from 'react-redux';
import { getTickerInfo, getPrices } from '../../util/iex_api_util';
import { fetchStocks, createTransaction } from '../../actions/stock_actions';
import { isEmpty } from 'lodash';

class Portfolio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tickerSymbol : "",
      qty : -1,
      submitButtonType : "BUY",
      buyPrice : null,
      latestPrices : {},
      openingPrices : {},
      changePercents : {},
      marketClosed : null,
      error : ""
    };
    
    this.convertToCurrency = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    this.handleBuy = this.handleBuy.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchStocks();

    if (!isEmpty(this.props.stocks)) {
      this.getPricesHelper();
      this.getPricesIntervalId = setInterval(this.getPricesHelper, 8000);
    }
  }

  componentDidUpdate(prevProps) {
    // if previously our stocks were empty and then we added a stock/stocks
    if (isEmpty(prevProps.stocks) && !isEmpty(this.props.stocks)) {
      this.getPricesHelper();
      this.getPricesIntervalId = setInterval(this.getPricesHelper, 8000);
    }
    // if previously we had stocks and then we removed all stocks (currently 
      // not possible, but implemented as a precaution/future change)
    else if (!isEmpty(prevProps.stocks) && isEmpty(this.props)) {
      clearInterval(this.getPricesIntervalId);
    }
  }

  componentWillUnmount() {
    clearInterval(this.getPricesIntervalId);
  }

  getPricesHelper(justAddedSymbol = undefined) {
    // clear the interval if getPrices .fail()?

    const { stocks } = this.props;

    let tickerSymbols = Object.values(stocks).map(stock => stock.ticker_symbol);
    if (justAddedSymbol) tickerSymbols.push(justAddedSymbol);

    getPrices(tickerSymbols)
      .then(res => {
        let keys = Object.keys(res);
        let latestPrices = {};
        let openingPrices = {};
        let changePercents = {};

        keys.forEach(symbol => {
          let latestPrice = res[symbol].quote.latestPrice;
          let openingPrice = res[symbol].quote.open;
          latestPrices[symbol] = latestPrice;
          
          // since the free API is limited, the opening price for the current day
            // isn't always returned (only returns from 8pm to 4:30am)
          // because of this, if the opening price is returned, use it
          // otherwise, use the previous closing price, which is always returned
          if (openingPrice) {
            openingPrices[symbol] = openingPrice;
          } else {
            openingPrices[symbol] = res[symbol].quote.previousClose;
          }

          changePercents[symbol] = Math.ceil(10000 * (latestPrice - openingPrices[symbol]) / openingPrices[symbol]) / 100;
        });

        // check if the market has closed
        // if the market has closed, there's no point in making API calls every
          // 8 seconds anymore, because the values aren't going to change until
          // the market opens again
        // (current free API is limited and doesn't show after-hour prices)
        if (!res[keys[0]].quote.isUSMarketOpen) {
          clearInterval(this.getPricesIntervalId);
          this.setState({
            marketClosed : true
          });
        } else {
          this.setState({
            marketClosed: false
          });
        }

        this.setState({
          latestPrices,
          openingPrices,
          changePercents
        });
      })
      .fail(res => {
        clearInterval(this.getPricesIntervalId);
      });
  }

  handleBuy(e) {
    e.preventDefault();

    const { tickerSymbol, qty } = this.state;

    // user entered some type of input for ticker
    if (tickerSymbol) {
      // user entered a valid quantity
      if (Number.isInteger(Number(qty)) && qty > 0) {
        getTickerInfo(tickerSymbol)
          .then(res => {
            this.setState({
              submitButtonType: "CONFIRM",
              buyPrice: res.latestPrice,
              error: ""
            });
          })
          // not a valid ticker symbol
          .fail(res => {
            if (res.status === 404) {
              this.setState({
                submitButtonType: "BUY",
                error: "Please enter a valid ticker!"
              });
            }
          });
      }
      // not a valid positive integer quantity
      else {
        this.setState({
          qty: -1,
          submitButtonType: "BUY",
          error: "Please enter a positive integer quantity!"
        });
      }
    }
    // user left the ticker symbol blank
    else {
      this.setState({
        submitButtonType: "BUY",
        error: "Please enter a valid ticker!"
      });
    }
  }

  handleConfirm(e) {
    e.preventDefault();

    const { currentUser } = this.props;
    const { tickerSymbol, qty, buyPrice } = this.state;

    let purchasePrice = buyPrice * qty;
    let userBalance = parseFloat(currentUser.balance);

    // the user doesn't have enough cash to buy the shares
    if (purchasePrice > userBalance) {
      this.setState({
        submitButtonType : "BUY",
        buyPrice : null,
        error: "You don't have enough cash!"
      });
    }
    // the user has enough cash to buy the shares
    else {
      this.props.createTransaction({
        ticker_symbol: tickerSymbol.toUpperCase(),
        shares: qty,
        price_per_share: buyPrice,
      });

      // fetch all prices so that we can immediately fetch the stock that the
        // user just added
      this.getPricesHelper(tickerSymbol.toUpperCase());

      this.setState({
        tickerSymbol: "",
        qty: -1,
        submitButtonType : "BUY",
        buyPrice : null,
        error: ""
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

  makeStockRows() {
    const { stocks } = this.props;
    const { latestPrices, openingPrices, changePercents } = this.state;

    return Object.values(stocks).reverse().map((stock, i) => {
      let sharesText = stock.shares > 1 ? "shares" : "share";

      let latestPrice = latestPrices[stock.ticker_symbol];
      let openingPrice = openingPrices[stock.ticker_symbol];
      let changePercent = changePercents[stock.ticker_symbol];
      let priceText = latestPrice ? (
        this.convertToCurrency.format(latestPrice)
      ) : "...";

      let plus = changePercent > 0 ? "+" : "";

      // give a dynamic class name to the price depending on the comparisons
      // we could have used inline styles here as well to simply give a color,
      // but inlne styling is more inefficient than using CSS
      let priceClassName = "";
      if (latestPrice < openingPrice) {
        priceClassName = "red";
      } else if (latestPrice === openingPrice) {
        priceClassName = "gray";
      } else if (latestPrice > openingPrice) {
        priceClassName = "green";
      }

      return (
        <tr className="stocks-table-row" key={i}>
          <td className="stocks-table-data ticker-symbol">{stock.ticker_symbol}</td>
          <td className="stocks-table-data num-shares">{stock.shares} {sharesText}</td>
          <td className={`stocks-table-data price`}>{priceText}</td>
          <td className={`stocks-table-data change-percents ${priceClassName}`}>{plus}{changePercent}%</td>
        </tr>
      );
    });
  }

  makeMarketMessage() {
    const { marketClosed } = this.state;
    let marketMessage;

    if (marketClosed === null) {
      if (!isEmpty(this.props.stocks)) {
        marketMessage = "...";
      } else {
        marketMessage = "";
      }
    } else if (!marketClosed) {
      marketMessage = "Prices will update every 8 seconds.";
    } else if (marketClosed) {
      marketMessage = "The market is currently closed.";
    }

    return marketMessage;
  }

  makePurchaseForm() {
    const { tickerSymbol, qty, error, submitButtonType, buyPrice } = this.state;

    let errorMessage = error ? (
      <p className="make-purchases-form-error">{error}</p>
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
          <span> {this.convertToCurrency.format(buyPrice * qty)} </span>
          (
          <span style={{ color: "lightskyblue" }}>{this.convertToCurrency.format(buyPrice)}/share</span>
          ).
        </p>
        ;
    }

    return (
      <>
        {errorMessage}
        {confirmPurchaseMessage}

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
      </>
    );
  }

  calculatePortfolioPrice() {
    const { latestPrices } = this.state;
    let portfolioPrice = 0.0;

    Object.values(this.props.stocks).forEach((stock) => {
      portfolioPrice += latestPrices[stock.ticker_symbol] * stock.shares;
    });

    if (!portfolioPrice) {
      portfolioPrice = 0.0;
    }

    return portfolioPrice;
  }

  render() {
    const { currentUser, stocks } = this.props;

    let stocksTable;

    if (isEmpty(stocks)) {
      stocksTable = 
        <p className="empty-message">
          You haven't purchased any stocks! Feel free to do some investing on the right.
        </p>
    } else {
      stocksTable =
        <table className="stocks-table">
          <tbody>
            { this.makeStockRows() }
          </tbody>
        </table>;
    }

    return (
      <>
        <header className="page-header">
          Portfolio ({this.convertToCurrency.format(this.calculatePortfolioPrice())})
          
          <p className="market-message">
            { this.makeMarketMessage() }
          </p>
        </header>

        <div className="portfolio-main-container">
          <section className="portfolio-left">
            <div className="stocks-container">
              { stocksTable }
            </div>
          </section>

          <section className="portfolio-right">
            <div className="make-purchases-container">
              <span className="portfolio-balance-container">
                Cash - <span className="portfolio-balance">{this.convertToCurrency.format(currentUser.balance)}</span>
              </span>

              { this.makePurchaseForm() }
            </div>
          </section>
        </div>
      </>
    );
  }
}

const msp = state => ({
  currentUser: state.entities.users[state.session.currentUserId],
  stocks: state.entities.stocks
});

const mdp = dispatch => ({
  fetchStocks: () => dispatch(fetchStocks()),
  createTransaction: transaction => dispatch(createTransaction(transaction))
});

export default connect(msp, mdp)(Portfolio);