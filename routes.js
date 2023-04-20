const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const stockController = require('./controllers/stockController');

// User routes
router.post('/user/register', userController.register);
router.post('/user/login', userController.login);
router.get('/user/logout', userController.logout);
router.get('/user/summary', userController.getUserSummary);

// Stock routes
router.get('/stocks', stockController.getAllStocks);
router.get('/stocks/:symbol', stockController.getStockBySymbol);
router.get('/stocks/:symbol/history', stockController.getStockHistory);

// Portfolio routes
router.get('/portfolio', userController.getPortfolio);
router.post('/portfolio/buy', userController.buyStock);
router.post('/portfolio/sell', userController.sellStock);

module.exports = router;
