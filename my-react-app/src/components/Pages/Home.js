import "../../styles/commonStyle.css";
import Header from "../Header/Header";
import AccountTable from "../Tables/AccountTable";

function Home() {
  return (
    <div>
      <div className="topnav">
        <Header activePage={"home"} />
      </div>
      <AccountTable />
    </div>
  );
}

export default Home;
