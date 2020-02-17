Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root to: 'static_pages#root'

  # put everything underneath the 'api' namespace, since all of these routes
    # will be used as a web API
  # rails should respond by default in the JSON format, since this is an API
  namespace :api, defaults: { format: :json } do
    resources :users, only: [:create]
    resources :transactions, only: [:create, :index]
    resources :stocks, only: [:create, :index, :show, :update]

    resource :session, only: [:create, :destroy]
  end
end