json.stocks do
  @stocks.each do |stock|
    json.set! stock.id do
      json.extract! stock, :id, :ticker_symbol, :shares
    end
  end
end