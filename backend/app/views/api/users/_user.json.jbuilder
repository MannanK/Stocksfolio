json.extract! user, :id, :name, :email
# put the database IDs in an array for all the transactions that belong to this
  # user
json.balance number_with_precision(user.balance, precision: 2)
json.transactions user.transactions.pluck(:id)
# put the database IDs in an array for all the stocks that belong to this user
json.stocks user.stocks.pluck(:id)