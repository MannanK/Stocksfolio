json.stock do
  json.partial! 'api/stocks/stock', stock: @current_stock
end

json.user do
  json.partial! 'api/users/user', user: @current_user
end