/**
 * This is a reusable component which puts together all 
 * of the componets that makes up the search page so 
 * the user can see all of then needed information 
 * about a stock.
 */
import "../../styles/commonStyle.css";
import Header from "../Header/Header";
import StockPerformance from "../Search/StockPerformance";
import StockTrade from "../Search/StockTrade";
import SearchTable from "../Tables/SearchTable";

function Search() {
  // gets the value that was searched for
  const searchParams = new URLSearchParams(window.location.search);
  const stockTicker = searchParams.get("search").toUpperCase();
  return (
    <div className="searchContent">
      <div className="topnav">
        <Header activePage={""} />
      </div>
      <StockTrade stockTicker={stockTicker} />
      <SearchTable stockTicker={stockTicker} />
      <div className="graph">
        <StockPerformance stockTicker={stockTicker} />
      </div>
    </div>
  );
}

export default Search;
