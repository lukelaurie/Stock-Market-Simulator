import "../../styles/commonStyle.css";
import Header from "../Header/Header";

function Profile() {
  return (
    <div>
      <div className="topnav">
        <Header activePage={"profile"} />
      </div>
      <div class="accountInfo">
        <h2>Account Information</h2>
        <p>Username: PLACEHOLDER</p>
        <p>First Name: PLACEHOLDER</p>
        <p>Last Name: PLACEHOLDER</p>
        <p>Email: PLACEHOLDER</p>
        <p>Phone Number: PLACEHOLDER</p>
        <p>Account Balance: PLACEHOLDER</p>
      </div>
    </div>
  );
}

export default Profile;
