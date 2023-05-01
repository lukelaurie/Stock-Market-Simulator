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
    fetch("http://localhost/api/users/summary", {
      method: "GET",
      credentials: "include"
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
              fetch("http://localhost/api/stock/fullname/" + sym).then(
                (nameResponce) => {
                  return nameResponce.text();
                }
              ),
              fetch("http://localhost/api/stock/day/" + sym).then(
                (priceResponce) => {
                  return priceResponce.json();
                }
              ),
            ]).then(([nameToDisplay, priceToDisplay]) => {
              // calculates all the needed information
              var stockName = nameToDisplay;
              var quantity = shares;
              var price = "$" + priceToDisplay["c"];
              // get the dolor and percentage change for the day
              var dailyChange =
                "$" +
                (Math.round(priceToDisplay["d"] * 100) / 100).toFixed(2) +
                " (" +
                (Math.round(priceToDisplay["dp"] * 100) / 100).toFixed(2) +
                "%)";
              var dailyChangeColor =
                priceToDisplay["d"] > 0 ? "#008000" : "#FF0000";
              // finds the stocks overall change compared to current price
              var gainAmount =
                (
                  Math.round(
                    (priceToDisplay["c"] - averagePrice) * shares * 100
                  ) / 100
                ).toFixed(2);
              var overallColor = gainAmount >= 0 ? "#008000" : "#FF0000";
              // Update the summary totals
              accountData["portfolioValue"] =
                accountData["portfolioValue"] + priceToDisplay["c"] * shares;
              // gets the data for the stock to be displayed on the row
              var stockData = {
                symbol: sym,
                stockName: stockName,
                quantity: quantity,
                price: price,
                dailyChange: dailyChange,
                gainLoss: "$" + gainAmount,
                dailyColor: { color: dailyChangeColor },
                overallColor: { color: overallColor },
              };
              allStocks.push(stockData);
            });
          })
        ).then(() => {
          // finds the accounts performance
          const accountStart = 10000;
          accountData["gainLoss"] = Math.round(
            cashBalance + accountData["portfolioValue"] - accountStart
          ).toFixed(2);
          accountData["portfolioValue"] = (Math.round(accountData["portfolioValue"] * 100) / 100).toFixed(2);
          // sets the correct coloring
          accountData["color"] =
            accountData["gainLoss"] >= 0
              ? { color: "#008000" }
              : { color: "#FF0000" };
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

export default Home;
