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
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

//const auth = require("./auth");
//const {getDailyInfo, getTimeUrl, regressionPrediction} = require('./api');


// Import and use the 'User' model
const User = require("./user.js");

// Import and use the 'Stock' model
const Stock = require("./Stock.js");


// Stock Controller
getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find({});
    if (!stocks) {
      return res.status(404).json({ message: 'No stocks found' });
    }
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching all stocks' });
  }
};

// Given a stock symbol, return the stock
getStockBySymbol = async (req, res) => {
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
};

// Given a stock symbol, return the stock's historical data
getStockHistory = async (req, res) => {
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
};
  
// User Controller

// Register a user
register = async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;

  if (!username || !email || !password || !phoneNumber) {
    return res.status(400).json({ message: 'Missing required fields: username, email, password, phoneNumber' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const newUser = new User({ username, email, password, phoneNumber });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while registering the user' });
  }
};
  
// Login a user
login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Set user information in the session
    req.session.user = {
      id: user._id,
      username: user.username
    };

    res.status(200).json({ message: "Logged in successfully" });
    } catch (error) {
    res.status(500).json({ message: "An error occurred during login" });
  }
};

// Logout a user
logout = async (req, res) => {
  // Clear the session
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "An error occurred while logging out" });
    }

    res.status(200).json({ message: "Logged out successfully" });
  });
};

// Get the user's summary
getUserSummary = async (req, res) => {
  try {
    // get the username from the login cookie
    let curCookie = req.cookies;
    console.log(curCookie);
    console.log("after cookie");

    const user = await User.findOne({ username: curCookie.login.username }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      cashBalance: user.cashBalance,
      holdings: user.holdings,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An error occurred while fetching user summary' });
  }
};

// Get the user's portfolio
getPortfolio = async (req, res) => {

  let curCookie = req.cookies;
  console.log(curCookie);
  username = curCookie.login.username;

  try {
    const user = await User.findOne({ username: username }).select('holdings');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.holdings);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching user portfolio' });
  }
};

// Buy a stock
buyStock = async (req, res) => {
  const { symbol, shares, price } = req.body;

  let curCookie = req.cookies;
  username = curCookie.login.username;
  
  if (!symbol || !shares || !price) {
    return res.status(400).json({ message: 'Missing required fields: symbol, shares, price' });
  }

  try {
    const user = await User.findOne({ username: username });
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
      user.holdings[holdingIndex].shares += Number(shares);
      user.holdings[holdingIndex].averagePrice = 
      (user.holdings[holdingIndex].averagePrice * (user.holdings[holdingIndex].shares - shares) + totalCost) / (user.holdings[holdingIndex].shares);
    } else {
      // Add new holding
      user.holdings.push({ symbol, shares, averagePrice: price });
    }

    user.cashBalance -= totalCost;
    await user.save();
    res.status(200).json({ message: 'Stock purchased successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An error occurred while buying the stock' });
  }
};

// Sell a stock
sellStock = async (req, res) => {
  const { symbol, shares, price } = req.body;

  let curCookie = req.cookies;
  console.log(curCookie);
  username = curCookie.login.username;

  if (!symbol || !shares || !price) {
    return res.status(400).json({ message: 'Missing required fields: symbol, shares, price' });
  }

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const holdingIndex = user.holdings.findIndex(holding => holding.symbol === symbol);

    if (holdingIndex < 0 || user.holdings[holdingIndex].shares < shares) {
      return res.status(400).json({ message: 'Insufficient shares to complete the transaction' });
    }

    const totalProceeds = shares * price;

    console.log("current shares: ", user.holdings[holdingIndex].shares + "\n shares: " + shares);

    // Reduce the shares of the holding
    user.holdings[holdingIndex].shares -= shares;

    // Remove the holding if the shares are 0
    if (user.holdings[holdingIndex].shares === 0) {
      console.log("removing holding");
      user.holdings.splice(holdingIndex, 1);
    }

    user.cashBalance += totalProceeds;
    await user.save();
    res.status(200).json({ message: 'Stock sold successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while selling the stock' });
  }
};

mongoose.connect("mongodb://127.0.0.1:27017/stockSimulation");

//auth.authenticatePages();

mongoose.connect("mongodb://127.0.0.1:27017/stockSimulation");

app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

// Stock routes
app.get('/api/stocks', getAllStocks);
app.get('/api/stocks/:symbol', getStockBySymbol);
app.get('/api/stocks/:symbol/history', getStockHistory);

// User routes
app.post('/api/users/register', register);
app.post('/api/users/login', login);
app.post('/api/users/logout', logout);
app.get('/api/users/summary', getUserSummary);
app.get('/api/users/portfolio', getPortfolio);
app.post('/api/users/portfolio/buy', buyStock);
app.post('/api/users/portfolio/sell', sellStock);


mongoose.connect("mongodb://127.0.0.1:27017/stockSimulation");

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
 * This is the code that gets ran whenever the client
 * makes a get request to the server at the url, in order
 * to get back the stocks full name from the tucker.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.get("/api/stock/fullname/:symbol", async (req, res) => {
  let curStock = req.params.symbol;
  let key = "ch0nj29r01qhadkofgl0ch0nj29r01qhadkofglg";
  // send back the name of the sotck
  let url =
    "https://finnhub.io/api/v1/stock/profile2?symbol=" +
    curStock +
    "&token=" +
    key;
  let responce = await fetch(url);
  let data = await responce.json();
  let name = data["name"];
  // remove the Inc associated with compant
  if (name == undefined) {
    res.send(curStock);
    return;
  }
  name = name.split(" ");
  if (name.length != 1) {
    let finalWord = name[name.length - 1].toLowerCase();
    if (finalWord == "inc" || finalWord == "co" || finalWord == "corp") {
      // stips off last part
      name = name.slice(0, name.length - 1);
    }
  }
  const joined = name.join(" ");
  res.send(joined);
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
  // Get the current date
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const timestamp = Math.floor(currentDate.getTime() / 1000);
  // determines the url to get the stock information at
  let apiKey = "ch0nj29r01qhadkofgl0ch0nj29r01qhadkofglg";
  let url =
    "https://finnhub.io/api/v1/quote?symbol=" + curStock + "&token=" + apiKey;
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
    .then((user) => {
      if (user.length == 0) {
        res.status(404).send("User not found.");
      } else {
        res.json(user.stocks);
      }
    })
    .catch((err) => {
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
  User.findById(curId).then((user) => {
    if (user.length == 0) {
      res.status(404).send("User not found.");
    } else {
      user.stocks.push(curStock);
      user
        .save()
        .then((updatedUser) => {
          res.send("success");
        })
        .catch((err) => {
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
    .then((data) => {
      if (!data || data.length == 0) {
        res.status(404).send("User not found.");
      } else {
        bcrypt
          .compare(curPassword, data.password)
          .then((isMatch) => {
            if (!isMatch) {
              res.end("ERROR");
            } else {
              // sessId = auth.addSession(data.username);
              sessId = addSession(data.username);
              res.cookie(
                "login",
                { username: data.username, sid: sessId },
                { maxAge: 1000 * 60 * 60, encode: String }
              );
              res.send("OKAY");
            }
          })
          .catch((err) => {
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

  User.findOne({ username: curUsername }).then((data) => {
    // If the username already exists, send back an error
    if (data && data.length != 0) {
      res.end("UEXISTS");
    } else {
      User.findOne({ email: curEmail }).then((data) => {
        // If the email already exists, send back an error
        if (data && data.length != 0) {
          res.end("EEXISTS");
        } else {
          User.findOne({ phoneNumber: curPhoneNumber }).then((data) => {
            // If the phone number already exists, send back an error
            if (data && data.length != 0) {
              res.end("PEXISTS");
            } else {
              // Save the user in the database
              const newUser = new User({
                username: curUsername,
                password: curPassword,
                email: curEmail,
                phoneNumber: curPhoneNumber,
              });
              newUser
                .save()
                .then(() => {
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

let sessions = {};

/*
 * This will add a session for the user to the sessions object.
 * @param {Object} user is the information about the user
 */
function addSession(user) {
  let sessionId = Math.floor(Math.random() * 100000);
  let sessionStart = Date.now();
  sessions[user] = { sid: sessionId, start: sessionStart };
  return sessionId;
}

/*
 * This will check if the user has a session.
 * @param {String} user is the information about the user
 * @param {String} sessionId is the id of the session
 */
function hasSession(user, sessionId) {
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
const SESSION_LENGTH = 1000 * 60 * 60;

setInterval(cleanupSessions, 2000);

/*
 * This will check to see if the user is currently logged in.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.get("/api/check/login", (req, res) => {
  // Check for cookies
  let curCookie = req.cookies;
  // Verify the existence of cookies (e.g. "id" and "username")
  if (
    curCookie &&
    curCookie.login &&
    curCookie.login.sid &&
    curCookie.login.username
  ) {
    // Check if the cookie is valid (e.g., using a function like 'hasSession')
    // This function should be implemented to look up the session in your database
    var result = hasSession(curCookie.login.username, curCookie.login.sid);
    if (result) {
      console.log("was valid");
      res.send("valid");
      return;
    }
  }
  res.send("invalid");
});

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

/*
 * This will get all of the daily stock information up until a
 * given date.
 * @param {String} curDate is the information about the which date
 * should be searched up to.
 * @param {String} curStock is the stock to get info about.
 */
async function getDailyInfo(curDate, curStock) {
  // gets the data at the correct url
  let url = getTimeUrl(curDate, curStock);
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
function getTimeUrl(curDate, curStock) {
  let apiKey = "ch0nj29r01qhadkofgl0ch0nj29r01qhadkofglg";
  // gets all the correct times and symbols
  const allDates = {
    day: [new Date(new Date().setDate(new Date().getDate() - 1)), "5"],
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
  // saves the prediction
  saveStockPrediction(stockName, percentage);
  return percentage.toString() + "%";
}

/*
=======
>>>>>>> c85011f0b070e1d08ec4f93519819806a3841a1b
 * This will either update the already existing value of the
 * prediction, or if not yet creaed it will create a new mapping.
 * @param {String} stockTicker is symbol for the stock.
 * @param {Number} prediction is the number representing how much
 * the stock may change.
 */
function saveStockPrediction(stockTicker, prediction) {
  stockTicker = stockTicker.toUpperCase();

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
 * This will set port 3000 as the location where the page
 * can be accesed.
 */
app.listen(80, () => {
  console.log("Listening on port 80");
});
