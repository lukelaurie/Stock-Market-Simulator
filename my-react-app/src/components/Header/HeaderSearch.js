import "../../styles/commonStyle.css";

function HeaderSearch() {
  return (
    <div className="search-container">
      <form action="search" method="get">
        <input type="text" placeholder="Stock Search.." name="search" />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default HeaderSearch;
