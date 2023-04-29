import "../../styles/loginStyle.css";
import { Link } from "react-router-dom";

function SignupLink() {
  return (
    <span class="signUp">
      <Link to="/register">
        <button className="signUpButton loginButton">
          Don't have an account? Make one here!
        </button>
      </Link>
    </span>
  );
}

export default SignupLink;
