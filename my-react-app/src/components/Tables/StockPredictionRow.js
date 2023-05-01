/**
 * This is a reusable component which displays the 
 * table row of information in the table.
 */
import "../../styles/commonStyle.css";

function StockPredictionRow(props) {
  const {
    stockSymbol,
    stockName,
    stockPrediction,
    stockPrice
  } = props;
  return (
    <tr>
      <td><a href={`./search?search=${stockSymbol}`}>{stockSymbol}</a></td>
      <td>{stockName}</td>
      <td>{stockPrediction}%</td>
      <td>${stockPrice}</td>
    </tr>
  );
}

export default StockPredictionRow;
