// Import mongoose to create the schema
const mongoose = require('mongoose');

// Define the UserSchema
const UserSchema = new mongoose.Schema({
  // The unique username for the user (required and unique)
  username: {
    type: String,
    required: true,
    unique: true
  },
  // The user's email address (required and unique)
  email: {
    type: String,
    required: true,
    unique: true
  },
  // The user's hashed password (required)
  password: {
    type: String,
    required: true
  },
  // An array of ObjectId references to the user's watchlists
  watchlists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Watchlist'
  }],
  // An array containing the user's portfolio stocks
  portfolio: [{
    // An ObjectId reference to the stock
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock'
    },
    // The number of shares owned by the user for this stock
    shares: {
      type: Number,
      default: 0
    }
  }]
});

// Export the User model based on UserSchema
module.exports = mongoose.model('User', UserSchema);
