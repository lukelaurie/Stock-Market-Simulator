import "../../styles/commonStyle.css";
import Header from "../Header/Header";
import AccountTable from "../Tables/AccountTable";
import StockSummary from "../Tables/StockSummary";

function Home() {
  return (
    <div>
      <div className="topnav">
        <Header activePage={"home"} />
      </div>
      <AccountTable /> 
      <StockSummary />
    </div>
  );
}

export default Home;
