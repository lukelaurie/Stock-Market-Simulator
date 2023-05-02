const fetch = require("node-fetch");
const regression = require("regression");
const Stock = require("./Stock.js");

/*
 * This will get all of the daily stock information up until a
 * given date.
 * @param {String} curDate is the information about the which date
 * should be searched up to.
 * @param {String} curStock is the stock to get info about.
 */
async function getDailyInfo(curDate, curStock) {
  // gets the data at the correct url
  let url = await getTimeUrl(curDate, curStock);
  const responce = await fetch(url);
  const data = await responce.json();
  if (curDate == "predictionInterval") {
    let prediction = regressionPrediction(data, curStock);
    return prediction;
  } else {
    return data;
  }
}

/*
 * This will create the correct url, such that the correct information
 * will be accessed from the url.
 * @param {String} curDate is the information about the which date
 * should be searched up to.
 * @param {String} curStock is the stock to get info about.
 * @return {Array} The url to access the data and the correct interval.
 */
async function getTimeUrl(curDate, curStock) {
  let apiKey = "ch0nj29r01qhadkofgl0ch0nj29r01qhadkofglg";
  // gets all the correct times and symbols
  const allDates = {
    day: [await getLatestTradingDay(apiKey, curStock), "5"],
    week: [new Date(new Date().setDate(new Date().getDate() - 7)), "30"],
    month: [new Date(new Date().setMonth(new Date().getMonth() - 1)), "60"],
    sixMonth: [new Date(new Date().setMonth(new Date().getMonth() - 6)), "D"],
    year: [new Date(new Date().setMonth(new Date().getMonth() - 12)), "D"],
    fiveYear: [
      new Date(new Date().setFullYear(new Date().getFullYear() - 5)),
      "W",
    ],
    predictionInterval: [
      new Date(new Date().setFullYear(new Date().getFullYear() - 5)),
      "D",
    ],
    allTime: [
      new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
      "W",
    ],
  };
  var startTime = allDates[curDate][0];
  const timePeriod = allDates[curDate][1];
  // Set the start time to midnight today
  startTime.setHours(0, 0, 0, 0);
  const startTimestamp = Math.floor(startTime.getTime() / 1000);
  // Set the end time to the current time
  const endTimestamp = Math.floor(Date.now() / 1000);
  let url =
    "https://finnhub.io/api/v1/stock/candle?symbol=" +
    curStock +
    "&resolution=" +
    timePeriod +
    "&from=" +
    startTimestamp +
    "&to=" +
    endTimestamp +
    "&token=" +
    apiKey;
  return url;
}

/*
 * This will use a linear regression model in order to determine
 * a stocks predicted amount of change over the next year.
 * @param {Object} data is all the information about the stock.
 * @param {String} stockName is the name of the stock.
 * @return {String} The predictd stock change.
 */
function regressionPrediction(data, stockName) {
  if (data["s"] == "no_data") {
    return "0.00%";
  }
  // gets the data points
  const prices = data["c"];
  const priceMappings = prices.map((price, index) => [index, price]);
  // Perform linear regression to predict future prices
  const result = regression.linear(priceMappings);
  const slope = result.equation[0];
  const intercept = result.equation[1];
  // predicts the performance for the next year
  const currentPrice = slope * prices.length + intercept;
  const futurePrice = slope * (prices.length + 252) + intercept;
  let percentage =
    ((futurePrice - currentPrice) /
      ((Math.abs(currentPrice) + Math.abs(futurePrice)) / 2)) *
    100;
  percentage = percentage.toFixed(2);
  saveStockPrediction(stockName, percentage);
  return percentage.toString() + "%";
}

/*
 * This will get whatever the latest trading day was.
 * @param {String} apiKey is the key for the api.
 * @param {String} symbol is the stock to get info about.
 * @return {Date} the date representing the latest trading day
 */
async function getLatestTradingDay(apiKey, symbol) {
  let url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
  let response = await fetch(url);
  let data = await response.json();
  // Extract the latest trading day from the response data
  const latestTradingDay = new Date(data.t * 1000);
  return latestTradingDay;
}

/*
 * This will either update the already existing value of the
 * prediction, or if not yet creaed it will create a new mapping.
 * @param {String} stockTicker is symbol for the stock.
 * @param {Number} prediction is the number representing how much
 * the stock may change.
 */
function saveStockPrediction(stockTicker, prediction) {
  stockTicker = stockTicker.toUpperCase();
  // limits the stocks that can be chosen
  if (prediction > 18) {
    return;
  }
  Stock.findOne({ ticker: stockTicker }).then((result) => {
    // checks if the stock exists or not
    if (result == null) {
      // creates a new datapoint
      Stock.create({ ticker: stockTicker, prediction: prediction });
    } else {
      // updates the value of the prediction
      result.prediction = prediction;
      result.save();
    }
  });
}

/*
 * This will find the top ten stock predictions, in the
 * database keeping track of the predictions.
 */
async function topStocks() {
  // finds all the existing stock predictions
  let curPrediction = await Stock.find({});
  let topStocks = [];
  // gets all of the stocks
  for (i in curPrediction) {
    let curStock = curPrediction[i];
    topStocks.push([curStock.ticker, curStock.prediction]);
  }
  // sorts the stocks in descending order
  topStocks.sort((a, b) => {
    return b[1] - a[1];
  });
  return topStocks;
}

module.exports = {
  getDailyInfo,
  getTimeUrl,
  regressionPrediction,
  topStocks
};
