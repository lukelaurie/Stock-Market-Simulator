// Import required dependencies
const Stock = require("./Stock.js");

const stockController = {
  getAllStocks: async (req, res) => {
    try {
      const stocks = await Stock.find({});
      if (!stocks) {
        return res.status(404).json({ message: 'No stocks found' });
      }
      res.status(200).json(stocks);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while fetching all stocks' });
    }
  },

  getStockBySymbol: async (req, res) => {
    try {
      const { symbol } = req.params;
      const stock = await Stock.findOne({ ticker: symbol.toUpperCase() });
      if (!stock) {
        return res.status(404).json({ message: `No stock found with symbol: ${symbol}` });
      }
      res.status(200).json(stock);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while fetching the stock by symbol' });
    }
  },

  getStockHistory: async (req, res) => {
    try {
      const { symbol } = req.params;
      const stock = await Stock.findOne({ ticker: symbol.toUpperCase() });

      if (!stock) {
        return res.status(404).json({ message: `No stock found with symbol: ${symbol}` });
      }

      const apiKey = process.env.IEX_API_KEY; // Replace with proper API key
      const apiUrl = `https://cloud.iexapis.com/stable/stock/${symbol}/chart/1y?token=${apiKey}`;

      const response = await axios.get(apiUrl);

      if (!response.data) {
        return res.status(404).json({ message: `No historical data found for symbol: ${symbol}` });
      }

      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while fetching the stock history' });
    }
  },

};

module.exports = stockController;
