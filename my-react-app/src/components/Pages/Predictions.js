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
