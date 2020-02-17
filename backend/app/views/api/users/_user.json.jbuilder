json.extract! user, :id, :name, :email
json.transactions user.transactions.pluck(:id)
json.stocks user.stocks.pluck(:id)