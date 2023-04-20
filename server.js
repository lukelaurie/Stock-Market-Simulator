/*
 * This will create a server using express which will
 * be able to take in a post requests from the user
 * allwoing them to create a new account, or add a new
 * stock to their existing account. It will also have get
 * requests allowing for the user to retreive the needed data.
 * Author: Luke Laurie 
 * Date: 4/8/2023
 */
// gets needed libraries
const express = require("express");
const regression = require("regression");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const bcrypt = require("bcryptjs");
const cookieparser = require("cookie-parser");

const app = express();

// Import and use the 'User' model
const User = require("./user.js");

// Import and use the 'Stock' model
const Stock = require("./Stock.js");

mongoose.connect('mongodb://127.0.0.1:27017/stockSimulation');

app.use(cookieparser());
authenticatePages();
app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.static("public_html"));

/*
 * This is the code that gets ran whenever the client
 * makes a get request to the server at the url, in order
 * to get back the prediction on how a stock will perform.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.get("/api/prediction/:symbol", async (req, res) => {
  let curStock = req.params.symbol;
  // send back the prediction
  const predictionValue = await getDailyInfo(
    "predictionInterval",
    curStock,
    res
  );
  res.send(predictionValue);
});

/*
 * This is search through all the stocks in the s&p 500 and
 * find the predicted top ten stocks
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.get("/api/stock/top", async (req, res) => {
  const predictionStocks = await topStocks();
  res.send(predictionStocks);
});

/*
 * This is the code that gets ran whenever the client
 * makes a get request to the server at the url, in order
 * to get back all the stock info up to a given date.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.post("/api/date/daily", async (req, res) => {
  let curStock = req.body.symbol;
  let curDate = req.body.date;
  // send back the data to the user
  let stockInfo = await getDailyInfo(curDate, curStock, res);
  res.send(stockInfo);
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

  // Go into database, find user with id, and send back json of db stock items
  User.findById(curId)
  .then ( (user) => {
    if (user.length == 0) {
      res.status(404).send("User not found.");
    }
    else {
      res.json(user.stocks);
    }
  })
  .catch ( (err) => {
    console.error(err);
    res.status(500).send("Error retrieving user stocks.");
  });
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

  // Go into database, find user with id, create new stock db item and add to user
  User.findById(curId)
  .then ( (user) => {
    if (user.length == 0) {
      res.status(404).send("User not found.");
    }
    else {
      user.stocks.push(curStock);
      user.save()
      .then ( (updatedUser) => {
        res.send("success");
      })
      .catch ( (err) => {
        console.error(err);
        res.status(500).send("Error updating user stocks.");
      });
    }
  });
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

  // Check if user in the db, if so create cookie/session and allow into the website
  User.findOne({ username: curUsername })
  .then( (data) => {
    if (!data || data.length == 0) {
      res.status(404).send("User not found.");
    }
    else {
      bcrypt.compare(curPassword, data.password)
      .then( (isMatch) => {
        if (!isMatch) {
          console.log("Match: " + isMatch);
          res.end("ERROR");
        }
        else {
          console.log("User logged in: " + data.username);
          sessId = addSession(data.username);
          res.cookie('login', {username: data.username, sid: sessId}, {maxAge: 1000*60*60, encode: String});
          res.end("OKAY");
        }
      })
      .catch( (err) => {
        console.error(err);
        res.end("ERROR");
      });
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error finding user.");
  });

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
  let curEmail = req.body.email;
  let curPhoneNumber = req.body.phoneNumber;

  User.findOne({ username: curUsername })
  .then( (data) => {
    // If the username already exists, send back an error
    if (data && data.length != 0) {
      res.end("UEXISTS");
    }
    else {

      User.findOne({ email: curEmail })
      .then( (data) => {
        // If the email already exists, send back an error
        if (data && data.length != 0) {
          res.end("EEXISTS");
        }
        else {
          User.findOne({ phoneNumber: curPhoneNumber })
          .then( (data) => {
            // If the phone number already exists, send back an error
            if (data && data.length != 0) {
              res.end("PEXISTS");
            }
            else {
              // Save the user in the database
              const newUser = new User({
                username: curUsername,
                password: curPassword,
                email: curEmail,
                phoneNumber: curPhoneNumber,
              });
              newUser.save()
              .then(() => {
                console.log("User saved successfully.");
                res.end("OKAY");
              })
              .catch((err) => {
                console.error(err);
                res.end("ERROR");
              });
            }
          });
        }
      });
    }
  });
});


/*
 * This is the code that gets ran whenever the client
 * makes a post request to the server at the url, in order
 * to logout from their account.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.post("/api/logout", (req, res) => {
  // Remove the user's cookies
  res.cookie("id", "", { expires: new Date(0) });
  res.cookie("username", "", { expires: new Date(0) });

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
  app.use("/search.html", authenticate);
}

let sessions = {};

/*
  * This will add a session for the user to the sessions object.
  * @param {Object} user is the information about the user
*/
function addSession(user) {
	let sessionId = Math.floor(Math.random() * 100000);
	let sessionStart = Date.now();
	sessions[user] = {'sid': sessionId, 'start': sessionStart}
  console.log("Session added for user: " + user + " with id: " + sessionId);
	return sessionId;
}

/*
  * This will check if the user has a session.
  * @param {String} user is the information about the user
  * @param {String} sessionId is the id of the session
*/
function hasSession(user, sessionId) {
  console.log("checking session");
  if (sessions[user] && sessions[user].sid == sessionId) {
    return true;
  }
  return false;
}

/*
  * This will remove a session for the user to the sessions object
*/
function cleanupSessions() {
	let now = Date.now();
	for (let user in sessions) {
		let session = sessions[user];
		if (session.start + SESSION_LENGTH < Date.now()) {
			delete sessions[user];
		}
	}
}

// Set session length to 10 minutes
const SESSION_LENGTH = 600000;

setInterval(cleanupSessions, 2000);

/*
 * This will check if the user can be validated with cookies.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 * @param {Object} The function to be ran if cookie is valid.
 */
function authenticate(req, res, next) {
  // Check for cookies
  let curCookie = req.cookies;
  console.log(curCookie.login);
  
  // Verify the existence of cookies (e.g. "id" and "username")
  if (curCookie && curCookie.login && curCookie.login.sid && curCookie.login.username) {
    console.log("Cookie found for user: " + curCookie.login.username + " with id: " + curCookie.login.sid);
    // Check if the cookie is valid (e.g., using a function like 'hasSession')
    // This function should be implemented to look up the session in your database
    var result = hasSession(curCookie.login.username, curCookie.login.sid);
    if (result) {
      next();
      return;
    }
  }
  else {
    res.redirect("/login.html");
  }

}


/*
 * This will parse all of the stock data to only get the needed amount of time.
 * @param {Object} data contains all of the stock information.
 * @param {String} time represents how much information to get for the stock.
 * @param {String} interval represents the interval of times to get the stock.
 * @returns {Object} Object with all of the correct stock information.
 */
function parseTime(data, time, interval) {
  const stockData = {};
  if (time == "predictionInterval") {
    time = "fiveYear";
  }
  // finds the correct date to compare with
  const allDates = {
    day: new Date(new Date().setDate(new Date().getDay() - 1)),
    week: new Date(new Date().setDate(new Date().getDay() - 7)),
    month: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    sixMonth: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    year: new Date(new Date().setMonth(new Date().getMonth() - 12)),
    fiveYear: new Date(new Date().setFullYear(new Date().getFullYear() - 5)),
    predictionInterval: new Date(new Date().setFullYear(new Date().getFullYear() - 5))
  };
  //console.log("time");
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
 * This will find the top ten stock predictions, in the 
 * database keeping track of the predictions.
 */
async function topStocks() {
  // finds all the existing stock predictions
  let curPrediction = await Stock.find({}); 
  let topStocks = [] 
  // gets all of the stocks 
  for (i in curPrediction) {
    let curStock = curPrediction[i];
    topStocks.push([curStock.ticker, curStock.prediction]);
  }
  // sorts the stocks in descending order
  topStocks.sort((a, b) => {
    return b[1] - a[1];
  });
  // gets the top ten stocks
  topStocks = topStocks.slice(0, 10);
  return topStocks;
}

/*
 * This will get all of the daily stock information up until a
 * given date.
 * @param {String} curDate is the information about the which date
 * should be searched up to.
 * @param {String} curStock is the stock to get info about.
 */
async function getDailyInfo(curDate, curStock) {
  // get the correct url
  let urlInfo = getTimeUrl(curDate, curStock);
  let url = urlInfo[0];
  let interval = urlInfo[1];
  const responce = await fetch(url);
  const data = await responce.json();
  // determines the correct input signal
  if (interval != "") {
    var inputSignal = "(" + interval.split("=")[1] + ")";
  } else {
    var inputSignal = "(Daily)";
  }
  // send back the data to the user or return out of function
  let finalInfo = parseTime(data, curDate, inputSignal);
  if (curDate == "predictionInterval") {
    let prediction = regressionPrediction(finalInfo, curStock);
    return prediction;
  } else {
    return finalInfo;
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
function getTimeUrl(curDate, curStock) {
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
  return [url, interval];
}

/*
 * This will use a linear regression model in order to determine
 * a stocks predicted amount of change over the next year.
 * @param {Object} data is all the information about the stock.
 * @param {String} stockName is the name of the stock.
 * @return {String} The predictd stock change.
 */
function regressionPrediction(data, stockName) {
  // Extract the closing prices from the data
  const allDates = Object.keys(data).sort();
  // gets all datapoints in sorted order
  const prices = allDates.map((item) =>
    parseFloat(data[item]["5. adjusted close"])
  );
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
  // saves the prediction
  saveStockPrediction(stockName, percentage)
  return percentage.toString() + "%";
}

/*
 * This will either update the already existing value of the 
 * prediction, or if not yet creaed it will create a new mapping.
 * @param {String} stockTicker is symbol for the stock.
 * @param {Number} prediction is the number representing how much
 * the stock may change.
 */
function saveStockPrediction(stockTicker, prediction) {
  Stock.findOne({ticker: stockTicker})
    .then(result => {
      // checks if the stock exists or not
      if (result == null) {
        // creates a new datapoint 
        Stock.create({ticker: stockTicker, prediction: prediction});
      } else {
        // updates the value of the prediction
        result.prediction = prediction; 
        result.save();
      }
    });
}

/*
 * This will set port 3000 as the location where the page
 * can be accesed.
 */
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
