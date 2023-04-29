import "../../styles/commonStyle.css";
import TableRow from "./StockSummaryRow";

function AccountTable() {
  return (
    <div className="accountSummary">
      <h2>Account Summary</h2>
      <table id="summary">
        <thead>
          <tr>
            <th>Account Value</th>
            <th>Gain/Loss</th>
            <th>Daily Change</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>New Row</td>
            <td>New Row</td>
            <td>New Row</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default AccountTable;
