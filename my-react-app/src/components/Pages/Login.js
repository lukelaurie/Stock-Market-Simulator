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
