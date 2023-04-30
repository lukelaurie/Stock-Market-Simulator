import "../../styles/commonStyle.css";
import StockPredictionRow from "./StockPredictionRow";
import StockPredictionHead from "./StockPredictionHead";
import { getTopStocks } from "../../utils/topstocks";

import React, { useEffect, useState } from "react";

function StockPredictionTable() {
  const [numStocks, setNumStocks] = useState(5);
  const [predctionStocks, setPredctionStocks] = useState([]);

  const loadMore = () => {
    setNumStocks(numStocks + 5);
  }

  // gets the data for the saerched stock
  useEffect(() => {
    topStocks();
  }, []);
  // gets all the top stocks
  const topStocks = () => {
    getTopStocks()
      .then((topStocks) => {
        console.log(topStocks);
        const promises = topStocks.map((stockInfo) => {
          const ticker = stockInfo[0];
          return Promise.all([
            fetch(`http://localhost/api/stock/fullname/${ticker}`).then((res) =>
              res.text()
            ),
            fetch(`http://localhost/api/stock/day/${ticker}`).then((res) =>
              res.json()
            ),
          ]).then(([name, price]) => ({
            stockSymbol: ticker,
            stockName: name,
            stockPrediction: stockInfo[1],
            stockPrice: price["c"],
          }));
        });
        return Promise.all(promises);
      })
      .then((stockObjects) => {
        setPredctionStocks(stockObjects);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const stocksToDisplay = predctionStocks.slice(0, numStocks);
  return (
    <div className="predictionContent">
      <h2>Top Stock Predictions</h2>
      <table className="predictionTable" id="tablePrediction">
        <StockPredictionHead />
        <tbody>
          {stocksToDisplay.map((curStockInfo, index) => (
            <StockPredictionRow
              key={index}
              stockSymbol={curStockInfo.stockSymbol}
              stockName={curStockInfo.stockName}
              stockPrediction={curStockInfo.stockPrediction}
              stockPrice={curStockInfo.stockPrice}
            />
          ))}
          <tr id="loadMoreRow">
            <td colSpan="4">
              <a href="#" onClick={loadMore}>Load More</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default StockPredictionTable;
