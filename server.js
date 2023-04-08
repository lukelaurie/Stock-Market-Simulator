/*
 * This will create a server using express which will
 * be able to take in a post requests from the user
 * allwoing them to create a new account, or add a new
 * stock to their existing account. It will also have get
 * requests allowing for the user to retreive the needed data.
 * Author: Luke Laurie
 * Date: 4/8/2023
 */
const express = require("express");

const app = express();

authenticatePages();

app.use(express.static("public_html"));
app.use(express.json());

/*
 * This is the code that gets ran whenever the client
 * makes a get request to the server at the url, in order
 * to get back the prediction on how a stock will perform.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.get("/api/prediction/:symbol", (req, res) => {
  // localhost:3000/api/stock/date/2023-01-01/IBM
  let curStock = req.params.symbol;

  // TODO -> run a prediction to predict how much a stock will increase over the next year

  res.send("10.00%");
});

/*
 * This is the code that gets ran whenever the client
 * makes a get request to the server at the url, in order
 * to get back all the stock info up to a given date.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.post("/api/date/daily", (req, res) => {
  let curStock = req.body.symbol;
  let curDate = req.body.date;
  // send back the data to the user
  getDailyInfo(curDate, curStock, res);
});

/*
 * This is the code that gets ran whenever the client
 * makes a get request to the server at the url, in order
 * to get back all the information about the day for a given stock.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.get("/api/stock/day/:symbol", (req, res) => {
  let curStock = req.params.symbol;
  // determines the url to get the stock information at
  let apiKey = "QKI4RBI2S56M014L";
  let url =
    "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" +
    curStock +
    "&apikey=QKI4RBI2S56M014L";
  fetch(url)
    .then((responce) => {
      return responce.json();
    })
    .then((data) => {
      // console.log(data["Global Quote"]["01. symbol"]);
      res.send(data);
    })
    .catch((err) => {
      res.send("invalid stock");
    });
});

/*
 * This is the code that gets ran whenever the client
 * makes a get request to the server at the url, in order
 * to get back all stocks associated with the user.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.get("/api/user/stocks", (req, res) => {
  let curCookie = req.cookies;
  let curId = curCookie.id;

  // TODO -> go into database, find user with id, and send back json of db stock items

  res.redirect("success");
});

/*
 * This is the code that gets ran whenever the client
 * makes a post request to the server at the url, in order
 * to add a new stock to the current user.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.post("/api/user/add/stock", (req, res) => {
  let curCookie = req.cookies;
  let curId = curCookie.id;
  let curStock = req.body.stock;

  // TODO -> go into database, find user with id, create new stock db item and add to user

  res.send("success");
});

/*
 * This is the code that gets ran whenever the client
 * makes a post request to the server at the url, in order
 * to check if a user exists in the database.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.post("/api/login", (req, res) => {
  let curUsername = req.body.username;
  let curPassword = req.body.password;

  // TODO -> check if user in the db, if so create cookie/session and allow into the website

  res.redirect("/index.html");
});

/*
 * This is the code that gets ran whenever the client
 * makes a post request to the server at the url, in order
 * to create a new user.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.post("/api/register", (req, res) => {
  let curUsername = req.body.username;
  let curPassword = req.body.password;

  // TODO -> save the user in the database

  res.redirect("/index.html");
});

/*
 * This is the code that gets ran whenever the client
 * makes a post request to the server at the url, in order
 * to logout from their account.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.post("/api/logout", (req, res) => {
  // TODO -> remove the users cookies

  res.redirect("/login.html");
});

/*
 * This will protect all of the html pages so that they cannot
 * be accessed without logging into the page first.
 */
function authenticatePages() {
  // checks if user has authoritie to log into the pages
  app.use("/help.html", authenticate);
  app.use("/index.html", authenticate);
  app.use("/predictions.html", authenticate);
  app.use("/profile.html", authenticate);
  app.use("/searchh.html", authenticate);
}

/*
 * This will check if the user can be validated with cookies.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 * @param {Object} The function to be ran if cookie is valid.
 */
function authenticate(req, res, next) {
  // TODO -> check for cookies
  let curCookie = true;
  if (curCookie) {
    // checks if the cookie exists
    //var result = hasSession(curCookie.user, curCookie.sessionId);
    var result = true;
    if (result) {
      next();
      return;
    }
  }
  // sent to login page if not yet logged in
  res.redirect("/login.html");
}

/*
 * This will parse all of the stock data to only get the needed amount of time.
 * @param {Object} data contains all of the stock information.
 * @param {String} time represents how much information to get for the stock.
 * @param {String} interval represents the interval of times to get the stock.
 */
function parseTime(data, time, interval) {
  const stockData = {};
  // finds the correct date to compare with
  const allDates = {
    day: new Date(new Date().setDate(new Date().getDay() - 1)),
    week: new Date(new Date().setDate(new Date().getDay() - 7)),
    month: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    sixMonth: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    year: new Date(new Date().setMonth(new Date().getMonth() - 12)),
    fiveYear: new Date(new Date().setFullYear(new Date().getFullYear() - 5)),
  };
  var checkDate = allDates[time];
  // Loop through all the data points and only keep the needed ones
  for (const date in data["Time Series " + interval]) {
    if (time == "allTime" || new Date(date.split(" ")[0]) >= checkDate) {
      stockData[date] = data["Time Series " + interval][date];
    }
  }
  return stockData;
}

/*
 * This will git all of the daily stock information up until a
 * given date.
 * @param {String} curDate is the information about the which date
 * should be searched up to.
 * @param {String} curStock is the stock to get info about.
 * @param {Object} res the responce sent back to the user.
 */
function getDailyInfo(curDate, curStock, res) {
  // determine the correct time intervals for each period
  var valuesFunction = "function=TIME_SERIES_DAILY_ADJUSTED";
  var interval = "";
  var outputsize = "&outputsize=full";
  if (curDate == "day") {
    valuesFunction = "function=TIME_SERIES_INTRADAY";
    interval = "&interval=5min";
  } else if (curDate == "week") {
    valuesFunction = "function=TIME_SERIES_INTRADAY";
    interval = "&interval=30min";
  } else if (curDate == "month") {
    valuesFunction = "function=TIME_SERIES_INTRADAY";
    interval = "&interval=60min";
  }
  // determines the url to get the stock information at
  let apiKey = "&apikey=QKI4RBI2S56M014L";
  let symbol = "&symbol=" + curStock;
  let url =
    "https://www.alphavantage.co/query?" +
    valuesFunction +
    symbol +
    interval +
    outputsize +
    apiKey;
  fetch(url)
    .then((responce) => {
      return responce.json();
    })
    .then((data) => {
      // determines the correct input signal
      if (interval != "") {
        var inputSignal = "(" + interval.split("=")[1] + ")";
      } else {
        var inputSignal = "(Daily)";
      }
      // send back the data to the user
      res.send(parseTime(data, curDate, inputSignal));
    })
    .catch((err) => {
      res.send("invalid stock");
    });
}

app.listen(3000, () => {
  console.log("Listening on port 3000");
});