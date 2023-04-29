import "../../styles/commonStyle.css";
import StockPredictionRow from "./StockPredictionRow";

function StockPrediction() {
  const propOne = {
    stockSymbol: "TSLA",
    stockName: "TESLA",
    stockPrediction: "20.00%",
    stockPrice: "$195.20",
  };
  const propTwo = {
    stockSymbol: "TSLA",
    stockName: "TESLA",
    stockPrediction: "20.00%",
    stockPrice: "$195.20",
  };

  return (
    <div className="predictionContent">
      <h2>Top Stock Predictions</h2>
      <table className="predictionTable" id="tablePrediction">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Prediction</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <StockPredictionRow {...propOne} />
          <StockPredictionRow {...propTwo} />
          <StockPredictionRow {...propOne} />
          <tr id="loadMoreRow">
            <td colSpan="4">
              <a href=" ">Load More</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default StockPrediction;
