/**
 * This is a reusable header that is used for the login page.
 */
import "../../styles/loginStyle.css";
import dollarSign from "../../img/dollarSign.png";
import stockChart from "../../img/stocks.png";

function LoginHeader() {
  return (
    <header>
            <img className="headerImage floatLeft" src={dollarSign} alt="Dollar Sign" />
            <img className="headerImage floatRight" src={stockChart} alt="Stock Market Chart" />
            <h1 className="headerText">Stock Market Simulator</h1>
    </header>
  );
}

export default LoginHeader;
