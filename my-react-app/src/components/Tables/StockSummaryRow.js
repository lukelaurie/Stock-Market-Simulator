import "../../styles/commonStyle.css";

function StockSummaryRow(props) {
  const {
    stockSymbol,
    stockName,
    stockQuantity,
    stockPrice,
    stockDailyChange,
    stockGain
  } = props;
  return (
    <tr>
      <td><a href={`./search?search=${stockSymbol}`}>{stockSymbol}</a></td>
      <td>{stockName}</td>
      <td>{stockQuantity}</td>
      <td>{stockPrice}</td>
      <td>{stockDailyChange}</td>
      <td>{stockGain}</td>
    </tr>
  );
}

export default StockSummaryRow;
