@stocks.each do |stock|
  json.set! stock.id do
    json.partial! 'api/stocks/stock', stock: stock
  end
end