const IEX_URL = "https://cloud.iexapis.com/stable/stock/";

export const getTickerInfo = tickerSymbol => (
  $.ajax({
    url: IEX_URL + tickerSymbol + "/quote?token=" + window.iexAPIKey
  })
);