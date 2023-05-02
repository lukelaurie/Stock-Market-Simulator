// Import and use the 'User' model
const User = require("./user.js");

// Import and use the 'Stock' model
const Stock = require("./Stock.js");

/*
 * This will get all of the stocks currently in the db
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
async function getAllStocks(req, res) {
  try {
    const stocks = await Stock.find({});
    if (!stocks) {
      return res.status(404).json({ message: "No stocks found" });
    }
    res.status(200).json(stocks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching all stocks" });
  }
}

/*
 * This will get a stock currently located in the db by its symbol.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
async function getStockBySymbol(req, res) {
  try {
    const { symbol } = req.params;
    const stock = await Stock.findOne({ ticker: symbol.toUpperCase() });
    if (!stock) {
      return res
        .status(404)
        .json({ message: `No stock found with symbol: ${symbol}` });
    }
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching the stock by symbol",
    });
  }
}

/*
 * This will get all of the infomation assoiated with the user.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
async function getUserSummary(req, res) {
  try {
    // get the username from the login cookie
    let curCookie = req.cookies;
    const user = await User.findOne({
      username: curCookie.login.username,
    }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      cashBalance: user.cashBalance,
      holdings: user.holdings,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching user summary" });
  }
}

/*
 * This will get all of the stocks that the user has purchased.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
async function getPortfolio(req, res) {
  let curCookie = req.cookies;
  username = curCookie.login.username;

  try {
    // finds the holdings associated with the user
    const user = await User.findOne({ username: username }).select("holdings");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.holdings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching user portfolio" });
  }
}

/*
 * This will update or add a value to the purchases given the
 * buying information given from the user.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
async function buyStock(req, res) {
  const { symbol, shares, price } = req.body;

  let curCookie = req.cookies;
  username = curCookie.login.username;

  if (!symbol || !shares || !price) {
    return res
      .status(400)
      .json({ message: "Missing required fields: symbol, shares, price" });
  }

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalCost = shares * price;

    if (user.cashBalance < totalCost) {
      return res
        .status(400)
        .json({ message: "Insufficient funds to complete the transaction" });
    }

    const holdingIndex = user.holdings.findIndex(
      (holding) => holding.symbol === symbol
    );

    if (holdingIndex >= 0) {
      // Update existing holding
      user.holdings[holdingIndex].shares += Number(shares);
      user.holdings[holdingIndex].averagePrice =
        (user.holdings[holdingIndex].averagePrice *
          (user.holdings[holdingIndex].shares - shares) +
          totalCost) /
        user.holdings[holdingIndex].shares;
    } else {
      // Add new holding
      user.holdings.push({ symbol, shares, averagePrice: price });
    }

    user.cashBalance -= totalCost;
    await user.save();
    res.status(200).json({ message: "Stock purchased successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while buying the stock" });
  }
}

/*
 * This will update or delte a value to the purchases given the
 * selling information given from the user.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
async function sellStock(req, res) {
  const { symbol, shares, price } = req.body;

  let curCookie = req.cookies;
  username = curCookie.login.username;

  if (!symbol || !shares || !price) {
    return res
      .status(400)
      .json({ message: "Missing required fields: symbol, shares, price" });
  }

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const holdingIndex = user.holdings.findIndex(
      (holding) => holding.symbol === symbol
    );

    if (holdingIndex < 0 || user.holdings[holdingIndex].shares < shares) {
      return res
        .status(400)
        .json({ message: "Insufficient shares to complete the transaction" });
    }

    const totalProceeds = shares * price;

    // Reduce the shares of the holding
    user.holdings[holdingIndex].shares -= shares;

    // Remove the holding if the shares are 0
    if (user.holdings[holdingIndex].shares === 0) {
      user.holdings.splice(holdingIndex, 1);
    }

    user.cashBalance += totalProceeds;
    await user.save();
    res.status(200).json({ message: "Stock sold successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while selling the stock" });
  }
}

module.exports = {
  getAllStocks,
  getStockBySymbol,
  getUserSummary,
  getPortfolio,
  buyStock,
  sellStock,
};
