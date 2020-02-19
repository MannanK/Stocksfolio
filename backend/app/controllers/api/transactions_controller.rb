class Api::TransactionsController < ApplicationController
  before_action :require_logged_in!

  def index
    @transactions = current_user.transactions

    render :index
  end

  def create
    @transaction = Transaction.new(transaction_params)
    @transaction.user_id = current_user.id

    @stocks = current_user.stocks
    @current_stock = @stocks.find_by(ticker_symbol: params[:ticker_symbol])
    
    # the user has bought shares for this ticker before
    if (@current_stock)
      @current_stock.shares += params[:shares]

    # the user is buying shares for this ticker for the first time
    else
      @current_stock = Stock.new(
        user_id: current_user.id,
        ticker_symbol: params[:ticker_symbol],
        shares: params[:shares]
      )
    end

    if @transaction.valid? && @current_stock.valid?
      @transaction.save!
      @current_stock.save!

      # update user balance
      current_user.balance -= (params[:shares] * params[:price_per_share])
      current_user.save!

      render 'api/stocks/index'
    else
      render json: ['There was an error processing the transaction'], status: 400
    end
  end

  private

  def transaction_params
    params.require(:transaction).permit(:ticker_symbol, :shares, :price_per_share)
  end
end