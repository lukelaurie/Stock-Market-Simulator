/**
 * This is a reusable component which displays the 
 * table containing all of the stocks top predictions 
 * where the user can click a link to view more stocks.
 */
import "../../styles/commonStyle.css";
import StockPredictionRow from "./StockPredictionRow";
import StockPredictionHead from "./StockPredictionHead";
import { getTopStocks } from "../../utils/topstocks";

import React, { useEffect, useState } from "react";

function StockPredictionTable() {
  const stocksPerLoad = 5;
  const [predctionStocks, setPredctionStocks] = useState([]);
  // keeps track of which numbered stock to look for
  const [numLoaded, setNumLoaded] = useState(stocksPerLoad);

  const loadMore = () => {
    setNumLoaded(numLoaded + 5);
  }

  // gets the data for the saerched stock
  useEffect(() => {
    topStocks(numLoaded);
  }, [numLoaded]);

  // gets all the top stocks
  const topStocks = (stockCount) => {
    getTopStocks()
      .then((topStocks) => {
        // finds the next 5 stocks
        if (stockCount >= topStocks.length) {
          var stocksToFind = topStocks.slice(stockCount - stocksPerLoad, topStocks.length);
        } else {
          var stocksToFind = topStocks.slice(stockCount - stocksPerLoad, stockCount);
        }
        const promises = stocksToFind.map((stockInfo) => {
          const ticker = stockInfo[0];
          // gets the name of the stock and daily info
          return Promise.all([
            fetch(`http://157.230.181.102:8080/api/stock/fullname/${ticker}`).then((res) =>
              res.text()
            ),
            fetch(`http://157.230.181.102:8080/api/stock/day/${ticker}`).then((res) =>
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
      // combines the previoud and newly found stocks
      .then((foundStocks) => {
        setPredctionStocks([...predctionStocks, ...foundStocks]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="predictionContent">
      <h2>Top Stock Predictions</h2>
      <table className="predictionTable" id="tablePrediction">
        <StockPredictionHead />
        <tbody>
          {predctionStocks.map((curStockInfo, index) => (
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
