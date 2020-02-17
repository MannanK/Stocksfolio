json.extract! user, :id, :name, :email
# put the database IDs in an array for all the transactions that belong to this
  # user
json.transactions user.transactions.pluck(:id)
# put the database IDs in an array for all the stocks that belong to this user
json.stocks user.stocks.pluck(:id)