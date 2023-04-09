// Import mongoose to create the schema
const mongoose = require('mongoose');

// Define the WatchlistSchema
const WatchlistSchema = new mongoose.Schema({
  // The name of the watchlist (required)
  name: {
    type: String,
    required: true
  },
  // An ObjectId reference to the user who owns the watchlist
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // An array of ObjectId references to the stocks in the watchlist
  stocks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock'
  }]
});

// Export the Watchlist model based on WatchlistSchema
module.exports = mongoose.model('Watchlist', WatchlistSchema);
