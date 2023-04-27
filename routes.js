const express = require('express');
const router = express.Router();
const userController = require('./userController');
const stockController = require('./stockController');

// Define isAuthenticated middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// User routes
router.post('/user/register', userController.register);
router.post('/user/login', userController.login);
router.get('/user/logout', userController.logout);
router.get('/user/summary', isAuthenticated, userController.getUserSummary);

// Stock routes
router.get('/stocks', stockController.getAllStocks);
router.get('/stocks/:symbol', stockController.getStockBySymbol);
router.get('/stocks/:symbol/history', stockController.getStockHistory);

// Portfolio routes
router.get('/portfolio', isAuthenticated, userController.getPortfolio);
router.post('/portfolio/buy', isAuthenticated, userController.buyStock);
router.post('/portfolio/sell', isAuthenticated, userController.sellStock);

module.exports = router;
