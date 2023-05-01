/**
 * This is a reusable component which puts together all 
 * of the componets that makes up the login page.
 */
import "../../styles/loginStyle.css";

import LoginHeader from "../Header/LoginHeader";
import LoginSection from "../Login/LoginSection";
import SignupLink from "../Login/SignupLink";

function Login() {
  return (
    <div>
      <LoginHeader />
      <div className="formContainer">
        <LoginSection />
        <SignupLink />
      </div>
    </div>
  );
}

export default Login;
