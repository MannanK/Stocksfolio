class Api::UsersController < ApplicationController
  # sign up
  def create
    passwordsMatch = params[:user][:password] == params[:user][:confirmPassword]

    @user = User.new(user_params)
    
    if passwordsMatch && @user.save
      login!(@user)
      render :show
    else
      @user.valid?
      errors = @user.errors.full_messages
      errors.push("The passwords must match") unless passwordsMatch

      render json: errors, status: 422
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password)
  end
end