import "../styles/commonStyle.css";

import HeaderLink from "./HeaderLink";
import HeaderSearch from "./HeaderSearch.js";

function Header(props) {
  const { activePage } = props;
  return (
    <div className="topnav">
      <h1>Stock Portfolio Simulator</h1>
      <HeaderLink curPage={activePage} />
      <HeaderSearch />
    </div>
  );
}

export default Header;
