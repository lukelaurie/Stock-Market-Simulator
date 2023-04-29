import "../../styles/commonStyle.css";
import StockPredictionRow from "./StockPredictionRow";

function StockPrediction() {
  const propOne = {
    stockSymbol: "TSLA",
    stockName: "TESLA",
    stockPrediction: "20.00%",
    stockPrice: "$195.20"
  };
  const propTwo = {
    stockSymbol: "TSLA",
    stockName: "TESLA",
    stockPrediction: "20.00%",
    stockPrice: "$195.20"
  };
  
  return (
    <div class="predictionContent">
      <h2>Top Stock Predictions</h2>
      <table class="predictionTable" id="tablePrediction">
        <tr>
          <th>Symbol</th>
          <th>Name</th>
          <th>Prediction</th>
          <th>Price</th>
        </tr>
        <StockPredictionRow {...propOne}/>
        <StockPredictionRow {...propTwo}/>
        <StockPredictionRow {...propOne}/> 
        <tr id="loadMoreRow">
          <td colspan="4"><a href=" ">Load More</a></td>
        </tr>
      </table>
    </div>
  );
}

export default StockPrediction;
