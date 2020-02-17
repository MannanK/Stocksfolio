class CreateTransactions < ActiveRecord::Migration[5.2]
  def change
    # each individual transaction for each user
    create_table :transactions do |t|
      t.integer :user_id, null: false, index: true
      t.string :ticker_symbol, null: false
      t.integer :shares, null: false
      t.decimal :price_per_share, null: false, precision: 8, scale: 2

      t.timestamps
    end
  end
end
