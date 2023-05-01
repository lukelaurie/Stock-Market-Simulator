import "../../styles/commonStyle.css";
import TableRow from "./StockSummaryRow";

function AccountTable(props) {
  let accountInfo = props.accountSummary; 
  return (
    <div className="accountSummary">
      <h2>Account Summary</h2>
      <table id="summary">
        <thead>
          <tr>
            <th>Portfolio Value</th>
            <th>Total Gain/Loss</th>
            <th>Buying Power</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${accountInfo.portfolioValue}</td>
            <td style={accountInfo.color}>{accountInfo.gainLoss}</td>
            <td>{accountInfo.buyingPower}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default AccountTable;
