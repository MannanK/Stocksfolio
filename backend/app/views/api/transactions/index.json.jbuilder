json.transactions do
  @transactions.each do |transaction|
    json.set! transaction.id do
      json.extract! transaction, :id, :ticker_symbol, :shares, :price_per_share
    end
  end
end