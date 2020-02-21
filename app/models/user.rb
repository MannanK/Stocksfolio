# == Schema Information
#
# Table name: users
#
#  id              :bigint           not null, primary key
#  name            :string           not null
#  email           :string           not null
#  password_digest :string           not null
#  session_token   :string           not null
#  balance         :decimal(8, 2)    default(5000.0)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class User < ApplicationRecord
  attr_reader :password
  
  validates :name, :email, :session_token, :balance, presence: true
  validates :email, :session_token, uniqueness: true
  validates :password_digest, presence: { message: 'Your password can\'t be blank.' }
  validates :password, length: { minimum: 6, allow_nil: true }

  # as soon as a new User is initialized, ensure they have a session token
  after_initialize :ensure_session_token

  # each user can have many transactions, and if so, will also have many stocks
  has_many :transactions
  has_many :stocks

  def self.generate_session_token
    SecureRandom.urlsafe_base64
  end

  def self.find_by_credentials(email, password)
    user = User.find_by(email: email)

    return user if user && user.is_password?(password)

    nil
  end

  # given a non-encrypted password, store it in the database as an encrypted
    # password using BCrypt
  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  # check to see if the given non-encrypted password hashes to the same
    # encrypted password stored in the database
  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  # if user doesn't have a session token, generate one for them by calling the
    # helper method to generate a session token
  def ensure_session_token
    self.session_token ||= User.generate_session_token
  end

  def reset_session_token!
    self.session_token = User.generate_session_token
    self.save!
    self.session_token
  end
end