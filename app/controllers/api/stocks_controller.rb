class Api::StocksController < ApplicationController
  before_action :require_logged_in!

  def index
    @stocks = current_user.stocks
  end
end