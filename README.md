# Stocksfolio

### [**_Link to Stocksfolio_**](http://stocksfolio.herokuapp.com/)

Stocksfolio is a stock portfolio web-app created for the NYC Tech Talent Pipeline fullstack assessment.

## Technologies

On the frontend, Stocksfolio uses **React**, **Redux**, **Webpack**, and **SCSS**, as well as libraries such as **JQuery** and **lodash**.

For the backend, Stocksfolio uses **Ruby on Rails** and **PostgreSQL** for the database, as well as gems such as **BCrypt** and **Jbuilder**.

The app is hosted on **Heroku**.

## Features

* User authentication and ability to register for an account and login (securely done via BCrypt and session tokens)
* Ability to buy shares of stock at its current price by specifying its ticker symbol and the number of shares (every user starts out with a default balance of $5,000)
* View a list of all transactions/trades you've made to date
* View your stocks portfolio (also known as a _Stocksfolio_): a list of all the stocks you own along with their current values
* Real-time updates (**updates are given every 8 seconds due to API limitations**) on the performance of your stocks:
  1. Red when the latest price is less than the day’s open price
  2. Gray when the latest price is equal to the day’s open price
  3. Green when the latest price is greater than the day’s open price
  * **Due to API limitations, the day's open price is available only after 8pm EST and before 4:30am EST. Due to this, if open prices are not available, the previous day's closing value is used for calculations instead.**
* A mobile-responsive experience: use the app seamlessly on either your desktop or phone

## Backend Schema

```ruby
create_table "stocks", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "ticker_symbol", null: false
    t.integer "shares", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_stocks_on_user_id"
  end

  create_table "transactions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "ticker_symbol", null: false
    t.integer "shares", null: false
    t.decimal "price_per_share", precision: 8, scale: 2, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_transactions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "session_token", null: false
    t.decimal "balance", precision: 8, scale: 2, default: "5000.0"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["session_token"], name: "index_users_on_session_token", unique: true
  end
```
* I decided to make 3 tables in my database: **users**, **stocks**, and **transactions**
* The **stocks** table is used to keep track of all the stocks a user has purchased, and the _total_ quantity of shares they have for those stocks
* The **transactions** table is used to keep track of each individual purchase the user makes, including which ticker symbol they bought, how many shares they bought, and how much each share was worth
* I decided to separate **stocks** and **transactions** into two tables because it makes it more efficient for the backend when we need to display the stocks table on the frontend; not separating the two tables would have meant the backend having to find each transaction each user has made for a specific stock, and then add up all the shares for that one stock to determine how many shares the user has -- this would have been very inefficient and would have put a strain on the backend
* Separating into these two tables also makes the app much more scalable

## Getting the latest prices from IEX
```js
...

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

        if (openingPrice) {
          openingPrices[symbol] = openingPrice;
        } else {
          openingPrices[symbol] = res[symbol].quote.previousClose;
        }

        changePercents[symbol] = Math.ceil(10000 * (latestPrice - openingPrices[symbol]) / openingPrices[symbol]) / 100;
      });

      if (!res[keys[0]].quote.isUSMarketOpen) {
        clearInterval(this.getPricesIntervalId);
        this.setState({
          marketClosed: true
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

...
```
* This is a snippet of code from a larger function which fetches all the latest prices from IEX and stores them in the React state, so that the app can dynamically display real-time price and percentage updates on the Portfolio page
* _getPrices(tickerSymbols)_ is a helper function which returns an AJAX promise that calls the IEX API; we use _then()_ to ensure we continue executing the remaining code only once IEX has returned to us the data
* We manually calculate the percentage change in the prices to calculate the gain or loss; depending on the time of the day and because of API limitations, we use either the day's opening price or the previous day's closing price
* **There is a check in place that will stop the continuous calling of the IEX API if the market has closed for the day**; this is because of API limitations that don't return after-hour prices (therefore the latest price will stay the same until the next market opening)
* **This check will save us API calls and therefore will not use up the free API calls limit**

## Media Queries

```css
@media (max-width: 850px) {
  .session-form-container {
    max-width: 70%;
  }
}

@media (max-height: 650px) {
  .session-form-container {
    margin: 3em auto;
  }
}

@media (max-width: 700px) {
  .stocks-container, .transactions-container {
    font-size: 0.9em;
  }

  .page-header {
    text-align: center;
    margin-top: 0.6em;
    margin-bottom: 0.6em;
  }
}
```
* These are just a few snippets of a handful of media queries that are present in the SCSS to allow for a responsive design between desktop and mobile

## Credits

All market data is obtained from and belongs to [IEX Cloud](https://iexcloud.io/).