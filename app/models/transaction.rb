# == Schema Information
#
# Table name: transactions
#
#  id              :bigint           not null, primary key
#  user_id         :integer          not null
#  ticker_symbol   :string           not null
#  shares          :integer          not null
#  price_per_share :decimal(8, 2)    not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class Transaction < ApplicationRecord
  validates :user_id, :ticker_symbol, :shares, :price_per_share, presence: true

  # each transaction belongs to a user
  belongs_to :user
end
