import "../../styles/loginStyle.css";

function SearchTable() {
  return (
    <div>
      <h3>Info</h3>
      <table className="stockTable">
        <thead>
          <tr>
            <th>Price</th>
            <th>Today's change</th>
            <th>Prediction</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td id="stockPrice">$0.00</td>
            <td id="stockChange">0.00%</td>
            <td id="stockPrediction">0.00%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default SearchTable;
