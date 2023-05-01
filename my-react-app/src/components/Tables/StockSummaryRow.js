/**
 * This is a reusable component which displays the 
 * table row of the stocks that where purchased 
 * by the user.
 */
import "../../styles/commonStyle.css";

function StockSummaryRow(props) {
  let stockData = props.stockData;
  return (
    <tr>
      <td><a href={`./search?search=${stockData.symbol}`}>{stockData.symbol}</a></td>
      <td>{stockData.stockName}</td>
      <td>{stockData.quantity}</td>
      <td>{stockData.price}</td>
      <td style={stockData.dailyColor}>{stockData.dailyChange}</td>
      <td style={stockData.overallColor}>{stockData.gainLoss}</td>
    </tr>
  );
}

export default StockSummaryRow;
