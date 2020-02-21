const IEX_QUOTE_URL = "https://cloud.iexapis.com/stable/stock/";
const IEX_BATCH_QUOTE_URL = "https://cloud.iexapis.com/stable/stock/market/batch?symbols=";
const IEX_SANDBOX_BATCH_QUOTE_URL = "https://sandbox.iexapis.com/stable/stock/market/batch?symbols=";
const FILTERS = "&filter=symbol,latestPrice,previousClose,open,isUSMarketOpen";

export const getTickerInfo = tickerSymbol => (
  $.ajax({
    url:
      IEX_QUOTE_URL +
      tickerSymbol +
      "/quote?token=" +
      window.iexAPIKey
  })
);

// export const getPrices = tickerSymbols => (
//   $.ajax({
//     url:
//       IEX_BATCH_QUOTE_URL +
//       tickerSymbols.join(",") +
//       "&types=quote&token=" +
//       window.iexAPIKey +
//       FILTERS
//   })
// );

// // sandbox URL for testing purposes
export const getPrices = tickerSymbols => (
  $.ajax({
    url:
      IEX_SANDBOX_BATCH_QUOTE_URL +
      tickerSymbols.join(",") +
      "&types=quote" +
      "&token=a" +
      FILTERS
  })
);