// Import mongoose to create the schema
const mongoose = require('mongoose');

// Define the StockSchema
const StockSchema = new mongoose.Schema({
  // The unique stock symbol (required and unique)
  symbol: {
    type: String,
    required: true,
    unique: true
  },
  // The stock's full name (required)
  name: {
    type: String,
    required: true
  },
  // The stock's current price (required)
  currentPrice: {
    type: Number,
    required: true
  },
  // An array containing the stock's historical data
  historicalData: [{
    // The date for the historical data point (required)
    date: {
      type: Date,
      required: true
    },
    // The price of the stock at that date (required)
    price: {
      type: Number,
      required: true
    }
  }],
  // The predicted growth percentage for the stock (optional)
  growthPrediction: {
    type: Number
  }
});

// Export the Stock model based on StockSchema
module.exports = mongoose.model('Stock', StockSchema);
