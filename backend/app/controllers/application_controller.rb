class ApplicationController < ActionController::Base
  # disables CSRF protection, allows testing from Postman
  # protect_from_forgery with: :null_session

  # make these methods useable in views
  helper_method :current_user, :logged_in?

  # get the actual current user who's logged in by checking for the session
    # token
  def current_user
    return nil unless session[:session_token]

    User.find_by(session_token: session[:session_token])
  end

  # check if someone is currently logged in
  def logged_in?
    !!current_user
  end

  def login!(user)
    session[:session_token] = user.reset_session_token!
  end

  # helper method used in other controllers to ensure that the controller
    # action method is run only when someone is currently logged in
  def require_logged_in!
    render json: ['You must be logged in!'], status: 401 unless logged_in?
  end
end