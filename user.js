const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  watchlists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Watchlist'
  }],
  portfolio: [{
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock'
    },
    shares: {
      type: Number,
      default: 0
    }
  }]
});

module.exports = mongoose.model('User', UserSchema);
