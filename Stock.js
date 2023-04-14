const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  ticker: String, 
  prediction: Number
});

module.exports = mongoose.model("Stock", stockSchema);