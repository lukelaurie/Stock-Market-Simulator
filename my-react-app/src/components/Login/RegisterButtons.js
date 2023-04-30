import "../../styles/loginStyle.css";
import { Link } from "react-router-dom";

function RegisterButtons({createUser}) {
  return (
    <div className="clearfix">
      <button onClick={createUser} className="signup loginButton">
        Sign Up
      </button>
      <Link to="/login">
        <button className="cancelbtn loginButton">Cancel</button>
      </Link>
    </div>
  );
}

export default RegisterButtons;
