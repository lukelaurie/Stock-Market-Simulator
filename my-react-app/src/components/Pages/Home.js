/**
 * This is a reusable component which puts together all
 * of the componets that makes up the main home page so,
 * that user can see and click on all the stocks in their
 * portfolio.
 */
import "../../styles/commonStyle.css";
import Header from "../Header/Header";
import AccountTable from "../Tables/AccountTable";
import StockSummary from "../Tables/StockSummary";
import React, { useEffect, useState } from "react";

function Home() {
  const [accountSummary, setAccountSummary] = useState({
    portfolioValue: 0.0,
    gainLoss: 0.0,
    buyingPower: "$0.00",
    color: { color: "#008000" },
  });
  const [predctionStocks, setPredctionStocks] = useState([{}]);

  // gets the data for the saerched stock
  useEffect(() => {
    dailyInfo();
  }, []);

  const dailyInfo = () => {
    fetch("http://stocksimulator.me:8080/user/summary", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        var allStocks = [];
        let holdings = data.holdings;
        var cashBalance = data.cashBalance;
        // Create the row in the summary table to store relevant data, and initianlize values
        const buyingPower =
          "$" + (Math.round(cashBalance.toString() * 100) / 100).toFixed(2);
        const accountData = {
          portfolioValue: 0.0,
          gainLoss: 0.0,
          buyingPower: buyingPower,
          color: { color: "#008000" },
        };

        // Loop over each holding and add it to the table. Also update summary totals
        Promise.all(
          holdings.map((holding) => {
            let sym = holding.symbol;
            let shares = holding.shares;
            let averagePrice = holding.averagePrice;

            return Promise.all([
              fetch(
                "http://stocksimulator.me:8080/api/stock/fullname/" + sym
              ).then((nameResponce) => {
                return nameResponce.text();
              }),
              fetch("http://stocksimulator.me:8080/api/stock/day/" + sym).then(
                (priceResponce) => {
                  return priceResponce.json();
                }
              ),
            ]).then(([nameToDisplay, priceToDisplay]) => {
              let stockInfo = [
                nameToDisplay,
                shares,
                priceToDisplay,
                averagePrice,
                sym,
              ];
              var stockData = runCalculations(stockInfo, accountData);
              allStocks.push(stockData);
            });
          })
        ).then(() => {
          // finds the accounts performance
          const accountStart = 10000;
          accountData["gainLoss"] = (
            Math.round(
              (cashBalance + accountData["portfolioValue"] - accountStart) * 100
            ) / 100
          ).toFixed(2);

          accountData["portfolioValue"] = (
            Math.round(accountData["portfolioValue"] * 100) / 100
          ).toFixed(2);
          // sets the correct coloring
          console.log(accountData["gainLoss"] );
          if (accountData["gainLoss"] >= 0) {
            accountData["color"] = { color: "#008000" };
            accountData["gainLoss"] =
              "+$" +
              (Math.round(Number(accountData["gainLoss"]) * 100) / 100).toFixed(
                2
              );
          } else {
            accountData["color"] = { color: "#FF0000" };
            accountData["gainLoss"] =
              "-$" +
              Math.abs(
                (
                  Math.round(Number(accountData["gainLoss"]) * 100) / 100
                ).toFixed(2)
              );
          }

          setAccountSummary(accountData);
          setPredctionStocks(allStocks);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <div className="topnav">
        <Header activePage={"home"} />
      </div>
      <AccountTable accountSummary={accountSummary} />
      <StockSummary allStocks={predctionStocks} />
    </div>
  );
}

function runCalculations(stockInfo, accountData) {
  // calculates all the needed information
  var stockName = stockInfo[0];
  var shares = stockInfo[1];
  var priceToDisplay = stockInfo[2];
  var averagePrice = stockInfo[3];
  var sym = stockInfo[4];
  var price = "$" + priceToDisplay["c"];
  var dollarPrice = Math.abs(priceToDisplay["d"]);
  var percentPrice = Math.abs(priceToDisplay["dp"]);
  // get the dolor and percentage change for the day
  var gainSymbol = priceToDisplay["d"] >= 0 ? "+" : "-";

  var dailyChange =
    gainSymbol +
    "$" +
    (Math.round(dollarPrice * 100) / 100).toFixed(2) +
    " (" +
    gainSymbol +
    (Math.round(percentPrice * 100) / 100).toFixed(2) +
    "%)";
  var dailyChangeColor = priceToDisplay["d"] > 0 ? "#008000" : "#FF0000";
  // finds the stocks overall change compared to current price
  var gainAmount = (
    Math.round((priceToDisplay["c"] - averagePrice) * shares * 100) / 100
  ).toFixed(2);
  // sets the correct styling and symbols
  if (gainAmount >= 0) {
    var overallColor = "#008000";
    gainAmount = "+$" + gainAmount;
  } else {
    var overallColor = "#FF0000";
    gainAmount = Math.abs(gainAmount);
    gainAmount = "-$" + gainAmount;
  }
  // Update the summary totals
  accountData["portfolioValue"] =
    accountData["portfolioValue"] + priceToDisplay["c"] * shares;
  // gets the data for the stock to be displayed on the row
  var stockData = {
    symbol: sym,
    stockName: stockName,
    quantity: shares,
    price: price,
    dailyChange: dailyChange,
    gainLoss: gainAmount,
    dailyColor: { color: dailyChangeColor },
    overallColor: { color: overallColor },
  };
  return stockData;
}

export default Home;
