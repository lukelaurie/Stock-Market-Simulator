import "../../styles/commonStyle.css";
import TableRow from "./StockSummaryRow";

function AccountTable() {
  return (
    <div class="accountSummary">
      <h2>Account Summary</h2>
      <table id="summary">
        <tr>
          <th>Account Value</th>
          <th>Gain/Loss</th>
          <th>Daily Change</th>
        </tr>
        <tr>
          <td>New Row</td>
          <td>New Row</td>
          <td>New Row</td>
        </tr>
      </table>
    </div>
  );
}

export default AccountTable;
