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
const cors = require("cors");
const auth = require("./auth");
const userInteraction = require("./userInteraction");
const { getDailyInfo, topStocks } = require("./api");

mongoose.connect("mongodb://127.0.0.1/stockSimulation");

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

// Connect to the MongoDB database
//db.connectDB();

// Import and use the 'User' model
const User = require("./user.js");

// Define routes from userInteraction
app.get("/user/summary", userInteraction.getUserSummary);
app.get("/stocks", userInteraction.getAllStocks);
app.get("/stocks/:symbol", userInteraction.getStockBySymbol);
app.get("/portfolio", userInteraction.getPortfolio);
app.post("/portfolio/buy", userInteraction.buyStock);
app.post("/portfolio/sell", userInteraction.sellStock);

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
              sessId = auth.addSession(data.username);
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
    var result = auth.hasSession(curCookie.login.username, curCookie.login.sid);
    if (result) {
      res.send("valid");
      return;
    }
  }
  res.send("invalid");
});

/*
 * This will set port 3000 as the location where the page
 * can be accesed.
 */
app.listen(80, () => {
  console.log("Listening on port 80");
});