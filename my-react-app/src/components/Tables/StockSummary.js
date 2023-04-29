import "../../styles/commonStyle.css";
import StockSummaryRow from "./StockSummaryRow";

function StockSummary() {
  const propOne = {
    stockSymbol: "TSLA",
    stockName: "value2",
    stockQuantity: "value3",
    stockPrice: "value4",
    stockDailyChange: "value5",
    stockGain: "value6",
  };
  const propTwo = {
    stockSymbol: "WMT",
    stockName: "value2",
    stockQuantity: "value3",
    stockPrice: "value4",
    stockDailyChange: "value5",
    stockGain: "value6",
  };
  
  return (
    <div class="stockSummary">
      <h2>Stock Summary</h2>
      <table>
        <tr>
          <th>Symbol</th>
          <th>Name</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Daily Change</th>
          <th>Gain/Loss</th>
        </tr>
        <StockSummaryRow {...propOne}/>
        <StockSummaryRow {...propTwo}/>
        <StockSummaryRow {...propTwo}/>
      </table>
    </div>
  );
}

export default StockSummary;
