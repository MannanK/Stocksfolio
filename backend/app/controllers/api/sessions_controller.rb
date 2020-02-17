class Api::SessionsController < ApplicationController
  def create
    @user = User.find_by_credentials(params[:user][:email], params[:user][:password])

    if @user 
      login!(@user)
      render 'api/users/show'
    else
      render json: ['We could not find an account with those credentials. Please try again.'], status: 401
    end
  end

  def destroy
    if current_user
      current_user.reset_session_token!
      session[:session_token] = nil

      render json: {}
    else
      render json: ['Logout failed'], status: 404
    end
  end
end