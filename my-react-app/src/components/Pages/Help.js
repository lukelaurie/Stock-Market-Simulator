import "../../styles/commonStyle.css";
import Header from "../Header/Header";

function Help() {
  return (
    <div>
      <div className="topnav">
        <Header activePage={"help"} />
      </div>
      <div className="help">
        <h2>Help</h2>
        <p>
          Welcome to Stock Portfolio simulator! Here's how to navigate the
          application:{" "}
        </p>
        <ul>
          <li>
            Click on the "Home" tab to view your account summary and stock
            summary.
          </li>
          <li>Click on the "Profile" tab to view your profile information.</li>
          <li>
            Click on the "Top Predictions" tab to view the top predictions for
            the day.
          </li>
          <li>Click on the "Help" tab to view this page.</li>
          <li>Use the search bar to search for a stock.</li>
        </ul>
      </div>
    </div>
  );
}

export default Help;
