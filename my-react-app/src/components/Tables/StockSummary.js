/**
 * This is a reusable component which displays the 
 * table which contains all of the stocks and info 
 * about them which were purchased by the user.
 */
import "../../styles/commonStyle.css";
import StockSummaryRow from "./StockSummaryRow";
function StockSummary(props) {
  var predctionStocks = props.allStocks;
  return (
    <div className="stockSummary">
      <h2>Stock Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Daily Change</th>
            <th>Gain/Loss</th>
          </tr>
        </thead>
        <tbody>
          {predctionStocks.sort((a, b) => (a.stockName > b.stockName) ? 1 : -1).map((stockData, index) => (
            <StockSummaryRow key={index} stockData={stockData} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StockSummary;
