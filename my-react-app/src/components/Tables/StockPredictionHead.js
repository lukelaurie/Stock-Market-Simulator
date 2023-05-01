/**
 * This is a reusable component which displays the 
 * table header of the prediction row in the table.
 */
import "../../styles/commonStyle.css";

function StockPredictionHead() {
  return (
    <thead>
      <tr>
        <th>Symbol</th>
        <th>Name</th>
        <th>Prediction</th>
        <th>Price</th>
      </tr>
    </thead>
  );
}

export default StockPredictionHead;
