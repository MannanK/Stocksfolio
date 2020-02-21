class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :name, null: false
      t.string :email, null: false, index: {unique: true}
      t.string :password_digest, null: false
      t.string :session_token, null: false, index: {unique: true}
      
      # precision: 8 will allow us to handle prices from -999,999.99 to 999,999.99
      # scale: 2 will allow for 2 digits after the decimal point
      t.decimal :balance, default: 5000.00, precision: 8, scale: 2

      t.timestamps
    end
  end
end
