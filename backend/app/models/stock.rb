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

class Stock < ApplicationRecord
  validates :user_id, :ticker_symbol, :shares, presence: true

  belongs_to :user
end