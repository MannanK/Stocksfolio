class CreateStocks < ActiveRecord::Migration[5.2]
  def change
    create_table :stocks do |t|
      t.integer :user_id, null: false, index: true
      t.string :ticker_symbol, null: false
      t.integer :shares, null: false

      t.timestamps
    end
  end
end
