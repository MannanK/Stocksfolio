class Api::TransactionsController < ApplicationController
  before_action :require_logged_in!

  def index
    @transactions = current_user.transactions

    render :index
  end

  def create
    @transaction = Transaction.new(transaction_params)
    @transaction.user_id = current_user.id

    # check if a stock already exists for this ticker symbol
    @current_stock = current_user.stocks.find_by(ticker_symbol: params[:transaction][:ticker_symbol])
    
    # the user has bought shares for this ticker before
    if (@current_stock)
      @current_stock.shares += params[:transaction][:shares].to_i

    # the user is buying shares for this ticker for the first time
    else
      @current_stock = Stock.new(
        user_id: current_user.id,
        ticker_symbol: params[:transaction][:ticker_symbol],
        shares: params[:transaction][:shares]
      )
    end

    # check if both the new transaction and new/updated stock are valid and
      # able to be saved in the database
    if @transaction.valid? && @current_stock.valid?
      @transaction.save!
      @current_stock.save!

      # update user balance
      @current_user = current_user
      @current_user.update!(balance: @current_user.balance - (params[:transaction][:shares].to_i * params[:transaction][:price_per_share].to_d))

      render 'api/stocks/show'
    else
      render json: ['There was an error processing the transaction'], status: 400
    end
  end

  private

  def transaction_params
    params.require(:transaction).permit(:ticker_symbol, :shares, :price_per_share)
  end
end