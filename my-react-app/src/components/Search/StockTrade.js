import "../../styles/loginStyle.css";

function StockTrade(props) {
  return (
    <div>
      <h2 id="stockTitle">{props.stockTicker}</h2>
      <div className="sharePurchase">
        <h3>Purchase Shares</h3>
        <form action="PLACEHOLDER">
          <label htmlFor="shares">Number of Shares:</label>
          <input type="number" id="shares" name="shares" min="1" max="100" />
          <input type="submit" value="Buy" id="sharesButton" />
        </form>
      </div>
      <div className="shareSell">
        <h3>Sell Shares</h3>
        <label htmlFor="shares">Number of Shares:</label>
        <input type="number" id="sell" name="shares" min="1" max="100" />
        <button onclick="sellShares" id="sellButton">
          Sell
        </button>
      </div>
    </div>
  );
}

export default StockTrade;
