import "../../styles/loginStyle.css";

function StockPerformance() {
  return (
    <div>
      <h3>Performance</h3>
      <table className="buttonTable">
        <tr className="buttonRow">
          <td>
            <button className="button" onclick="changeGraph('day')">
              1D
            </button>
          </td>
          <td>
            <button className="button" onclick="changeGraph('week')">
              1W
            </button>
          </td>
          <td>
            <button className="button" onclick="changeGraph('month')">
              1M
            </button>
          </td>
          <td>
            <button className="button" onclick="changeGraph('sixMonth')">
              6M
            </button>
          </td>
          <td>
            <button className="button" onclick="changeGraph('year')">
              1Y
            </button>
          </td>
          <td>
            <button className="button" onclick="changeGraph('fiveYear')">
              5Y
            </button>
          </td>
          <td>
            <button className="button" onclick="changeGraph('allTime')">
              All
            </button>
          </td>
        </tr>
      </table>
    </div>
  );
}

export default StockPerformance;
