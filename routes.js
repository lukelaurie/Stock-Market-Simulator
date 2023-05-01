const express = require('express');
const router = express.Router();

const { hasSession } = require('./auth');

const {
  register,
  login,
  logout,
  getUserSummary,
  getAllStocks,
  getStockBySymbol,
  getStockHistory,
  getPortfolio,
  buyStock,
  sellStock,
} = require('./server');

const isAuthenticated = (req, res, next) => {
  const curCookie = req.cookies;
  if (curCookie && curCookie.login && curCookie.login.sid && curCookie.login.username && hasSession(curCookie.login.username, curCookie.login.sid)) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};


// User routes
router.post('/user/register', register);
router.post('/user/login', login);
router.get('/user/logout', logout);
router.get('/user/summary', isAuthenticated, getUserSummary);

// Stock routes
router.get('/stocks', getAllStocks);
router.get('/stocks/:symbol', getStockBySymbol);
router.get('/stocks/:symbol/history', getStockHistory);

// Portfolio routes
router.get('/portfolio', isAuthenticated, getPortfolio);
router.post('/portfolio/buy', isAuthenticated, buyStock);
router.post('/portfolio/sell', isAuthenticated, sellStock);

module.exports = router;
