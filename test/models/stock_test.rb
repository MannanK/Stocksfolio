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

require 'test_helper'

class StockTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
