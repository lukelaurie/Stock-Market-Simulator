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
          {predctionStocks.map((stockData, index) => (
            <StockSummaryRow key={index} stockData={stockData} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StockSummary;
