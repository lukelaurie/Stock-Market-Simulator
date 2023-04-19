// Import the required libraries and dependencies
const mongoose = require("mongoose");

// Define the schema for the Stock model
const stockSchema = new mongoose.Schema({
  // The stock's ticker symbol (e.g., 'AAPL' for Apple Inc.)
  ticker: {
    type: String,
    required: true,
    unique: true
  },

  // The stock's predicted price change, as a percentage
  prediction: {
    type: Number,
    required: true
  },

  // The last time the prediction was updated
  lastUpdated: {
    type: Date,
    required: true,
    default: Date.now
  }
});

// Create and export the Stock model using the stockSchema
const Stock = mongoose.model("Stock", stockSchema);
module.exports = Stock;
