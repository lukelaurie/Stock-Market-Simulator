/**
 * This is a reusable component which puts together all 
 * of the componets that makes up the prediction page 
 * which includes the table and a link to load more stocks.
 */
import "../../styles/commonStyle.css";
import Header from "../Header/Header";
import StockPrediction from "../Tables/StockPredictionTable";

function Predictions() {
  return (
    <div>
      <div className="topnav">
        <Header activePage={"predictions"} />
      </div>
      <StockPrediction />
    </div>
  );
}

export default Predictions;
