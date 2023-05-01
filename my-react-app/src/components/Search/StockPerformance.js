/**
 * This is a reusable component which provides the 
 * bar allowing the user to swap between the different 
 * charts.
 */
import "../../styles/loginStyle.css";
import { useEffect, useState } from "react";
import StockChart from "./StockChart";


function StockPerformance(props) {
  const [time, setTime] = useState("day");
  const [selectedButton, setSelectedButton] = useState(0); 

  const clickStockTime = (timeInterval, stockIndex) => {
    setTime(timeInterval);
    setSelectedButton(stockIndex);
  };

  return (
    <div>
      <h3>Performance</h3>
      <table className="buttonTable">
        <tr className="buttonRow">
          <td>
            <button style={{backgroundColor: selectedButton === 0 ? '#CCCCCC' : '#EFEFEF'}} className="button" onClick={() => clickStockTime("day", 0)}>
              1D
            </button>
          </td>
          <td>
            <button style={{backgroundColor: selectedButton === 1 ? '#CCCCCC' : '#EFEFEF'}} className="button" onClick={() => clickStockTime('week', 1)}>
              1W
            </button>
          </td>
          <td>
            <button style={{backgroundColor: selectedButton === 2 ? '#CCCCCC' : '#EFEFEF'}} className="button" onClick={() => clickStockTime('month', 2)}>
              1M
            </button>
          </td>
          <td>
            <button style={{backgroundColor: selectedButton === 3 ? '#CCCCCC' : '#EFEFEF'}} className="button" onClick={() => clickStockTime('sixMonth', 3)}>
              6M
            </button>
          </td>
          <td>
            <button style={{backgroundColor: selectedButton === 4 ? '#CCCCCC' : '#EFEFEF'}} className="button" onClick={() => clickStockTime('year', 4)}>
              1Y
            </button>
          </td>
          <td>
            <button style={{backgroundColor: selectedButton === 5 ? '#CCCCCC' : '#EFEFEF'}} className="button" onClick={() => clickStockTime('fiveYear', 5)}>
              5Y
            </button>
          </td>
          <td>
            <button style={{backgroundColor: selectedButton === 6 ? '#CCCCCC' : '#EFEFEF'}} className="button" onClick={() => clickStockTime('allTime', 6)}>
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
