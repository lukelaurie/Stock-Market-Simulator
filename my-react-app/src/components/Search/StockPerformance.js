import "../../styles/loginStyle.css";
import { useEffect, useState } from "react";
import StockChart from "./StockChart";


function StockPerformance(props) {
  const [time, setTime] = useState("fiveYear");

  return (
    <div>
      <h3>Performance</h3>
      <table className="buttonTable">
        <tr className="buttonRow">
          <td>
            <button className="button" onClick={() => setTime('day')}>
              1D
            </button>
          </td>
          <td>
            <button className="button" onClick={() => setTime('week')}>
              1W
            </button>
          </td>
          <td>
            <button className="button" onClick={() => setTime('month')}>
              1M
            </button>
          </td>
          <td>
            <button className="button" onClick={() => setTime('sixMonth')}>
              6M
            </button>
          </td>
          <td>
            <button className="button" onClick={() => setTime('year')}>
              1Y
            </button>
          </td>
          <td>
            <button className="button" onClick={() => setTime('fiveYear')}>
              5Y
            </button>
          </td>
          <td>
            <button className="button" onClick={() => setTime('allTime')}>
              All
            </button>
          </td>
        </tr>
      </table>
      <StockChart stockTicker={props.stockTicker} time={time} />

    </div>
  );
}

export default StockPerformance;
