/**
 * This is a reusable component which puts together all
 * of the componets that makes up the help page.
 */
import "../../styles/commonStyle.css";
import Header from "../Header/Header";

function Help() {
  return (
    <div>
      <div className="topnav">
        <Header activePage={"help"} />
      </div>
      <div className="help">
        <h2>How to Navigate the Application</h2>
        <p>
          Welcome to Stock Portfolio Simulator! Here's how you can navigate the
          application:
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
        <h2>How to Buy and Sell Stocks</h2>
        <p>
          After navigating to the search page, you can buy and sell stocks with
          $10,000 of fake money by following these steps:
        </p>
        <ul>
          <li>
            Click on the time period of the graph intervals and view the
            prediction to determine whether you would like to purchase or sell
            shares of the stock you are viewing.
          </li>
          <li>
            To buy a stock, enter the number of shares you want to purchase and
            click on the "Buy" button.
          </li>
          <li>
            To sell a stock, enter the number of shares you want to sell and
            click on the "Sell" button.
          </li>
          <li>
            Return to the Home page to see your adjusted stocks and to view more
            information about your overall stock performance.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Help;
