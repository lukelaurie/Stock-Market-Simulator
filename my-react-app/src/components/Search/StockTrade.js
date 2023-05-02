/**
 * This is a reusable component which allows for a 
 * user to be able to buy and sell shares of a searched 
 * stock.
 */
import "../../styles/loginStyle.css";
import { useEffect, useState } from "react";

function StockTrade(props) {
  const stockTicker = props.stockTicker;
  const [buyShares, setBuyShares] = useState(0);
  const [sellShares, setSellShares] = useState(0);

  const handleBuyChange = (event) => {
    setBuyShares(event.target.value);
  };

  // function to run whenever the user purchases a stock
  const handleBuySubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost/api/stock/day/" + stockTicker)
      .then((response) => {
        return response.json();
      })
      // sends request to the server to buy the stocks
      .then((data) => {
        fetch("http://localhost/portfolio/buy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            symbol: stockTicker,
            shares: buyShares,
            price: Number(data["c"]),
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error buying stock!");
            }
            return response.json();
          })
          .then((data) => {
            // rounds to 2 decimal places
            const totalPayment = (Math.round((buyShares * Number(data["c"])) * 100) / 100).toFixed(2);
            // alers message that the stock has been bought
            alert(
              buyShares +
                " shares of " +
                stockTicker +
                " successfully purchased at $" +
                data["c"] +
                " per share for a total of $" +
                totalPayment
            );
          })
          .catch((error) => {
            alert("Insufficient funds to complete the transaction");
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // function that gets ran whenever a user sells a stock
  const handleSellSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost/api/stock/day/" + stockTicker)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        fetch("http://localhost/portfolio/sell", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    symbol: stockTicker,
                    shares: sellShares,
                    price: data["c"]
                })
        })
        .then ((response) => {
            if (!response.ok) {
                throw new Error("Error selling stock!");
            }
            return response.json();
        })
        // message about information from stocks sold
        .then ((data) => {
            // rounds to 2 decimal places
            const totalPayment = (Math.round(sellShares * data["c"] * 100) / 100).toFixed(2);
            alert(sellShares + " shares of " + stockTicker + " successfully sold at $" + 
            data["c"] + " per share for a total of $" + totalPayment);
        })
        .catch((error) => {
            alert("Insufficient shares to complete the transaction");
        });
    })
    .catch((error) => {
        console.log(error);
    });
  };

  const handleSellChange = (event) => {
    setSellShares(event.target.value);
  };

  return (
    <div>
      <h2 id="stockTitle">{props.stockTicker}</h2>
      <div className="sharePurchase">
        <h3>Purchase Shares</h3>
        <label htmlFor="shares">Number of Shares:</label>
        <input
          type="number"
          id="shares"
          name="shares"
          min="1"
          max="100"
          onChange={handleBuyChange}
        />
        <input
          type="submit"
          value="Buy"
          id="sharesButton"
          onClick={handleBuySubmit}
        />
      </div>
      <div className="shareSell">
        <h3>Sell Shares</h3>
        <label htmlFor="shares">Number of Shares:</label>
        <input
          type="number"
          id="sell"
          name="shares"
          min="1"
          max="100"
          onChange={handleSellChange}
        />
        <button id="sellButton" onClick={handleSellSubmit}>
          Sell
        </button>
      </div>
    </div>
  );
}

export default StockTrade;
