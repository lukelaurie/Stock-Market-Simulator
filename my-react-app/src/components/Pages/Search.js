import "../../styles/commonStyle.css";
import Header from "../Header/Header";
import StockChart from "../Search/StockChart";
import StockPerformance from "../Search/StockPerformance";
import StockTrade from "../Search/StockTrade";
import SearchTable from "../Tables/SearchTable";

function Search() {
  return (
    <div className="searchContent">
      <div className="topnav">
        <Header activePage={""} />
      </div>
      <StockTrade />
      <SearchTable />
      <div className="graph">
        <StockPerformance />
        <StockChart />
      </div>
    </div>
  );
}

export default Search;
