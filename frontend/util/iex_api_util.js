const IEX_QUOTE_URL = "https://cloud.iexapis.com/stable/stock/";
const IEX_BATCH_QUOTE_URL = "https://cloud.iexapis.com/stable/stock/market/batch?symbols=";

export const getTickerInfo = tickerSymbol => (
  $.ajax({
    url: IEX_QUOTE_URL + tickerSymbol + "/quote?token=" + window.iexAPIKey
  })
);

export const getPrices = tickerSymbols => (
  $.ajax({
    url: IEX_BATCH_QUOTE_URL + tickerSymbols.join(",") + "&types=quote&token=" + window.iexAPIKey
  })
);