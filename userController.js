const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const bcrypt = require('bcryptjs');

const userController = {
  register: async (req, res) => {
    // Registration logic
  },

  login: async (req, res) => {
    // Login logic
  },

  logout: async (req, res) => {
    // Logout logic
  },

  getUserSummary: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.user.username }).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({
        cashBalance: user.cashBalance,
        holdings: user.holdings,
      });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while fetching user summary' });
    }
  },

  getPortfolio: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.user.username }).select('holdings');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user.holdings);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while fetching user portfolio' });
    }
  },

  buyStock: async (req, res) => {
    const { symbol, shares, price } = req.body;
  
    if (!symbol || !shares || !price) {
      return res.status(400).json({ message: 'Missing required fields: symbol, shares, price' });
    }

    try {
      const user = await User.findOne({ username: req.user.username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const totalCost = shares * price;

      if (user.cashBalance < totalCost) {
        return res.status(400).json({ message: 'Insufficient funds to complete the transaction' });
      }

      const holdingIndex = user.holdings.findIndex(holding => holding.symbol === symbol);

      if (holdingIndex >= 0) {
        // Update existing holding
        user.holdings[holdingIndex].shares += shares;
        user.holdings[holdingIndex].averagePrice = (user.holdings[holdingIndex].averagePrice * user.holdings[holdingIndex].shares + totalCost) / (user.holdings[holdingIndex].shares + shares);
      } else {
        // Add new holding
        user.holdings.push({ symbol, shares, averagePrice: price });
      }

      user.cashBalance -= totalCost;
      await user.save();
      res.status(200).json({ message: 'Stock purchased successfully' });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while buying the stock' });
    }
  },


  sellStock: async (req, res) => {
    const { symbol, shares, price } = req.body;

    if (!symbol || !shares || !price) {
      return res.status(400).json({ message: 'Missing required fields: symbol, shares, price' });
    }

    try {
      const user = await User.findOne({ username: req.user.username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const holdingIndex = user.holdings.findIndex(holding => holding.symbol === symbol);

      if (holdingIndex < 0 || user.holdings[holdingIndex].shares < shares) {
        return res.status(400).json({ message: 'Insufficient shares to complete the transaction' });
      }

      const totalProceeds = shares * price;

      if (user.holdings[holdingIndex].shares === shares) {
        // Remove the holding entirely
        user.holdings.splice(holdingIndex, 1);
      } else {
        // Reduce the shares of the holding
        user.holdings[holdingIndex].shares -= shares;
      }

      user.cashBalance += totalProceeds;
      await user.save();
      res.status(200).json({ message: 'Stock sold successfully' });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while selling the stock' });
    }
  },

};

module.exports = userController;
