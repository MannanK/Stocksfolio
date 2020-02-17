# == Schema Information
#
# Table name: stocks
#
#  id            :bigint           not null, primary key
#  user_id       :integer          not null
#  ticker_symbol :string           not null
#  shares        :integer          not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

# each stock will be getting continuously updated after a new transaction is
  # received for that same ticker symbol
class Stock < ApplicationRecord
  validates :user_id, :ticker_symbol, :shares, presence: true

  # each stock belongs to a user
  belongs_to :user
end