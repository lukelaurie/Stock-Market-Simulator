import "../../styles/loginStyle.css";
import LoginHeader from "../Header/LoginHeader";
import LoginSection from "../Login/LoginSection";
import SignupLink from "../Login/SignupLink";

function Register() {
  return (
    <div>
    <h1>But we registering rn</h1>
      <LoginHeader />
      <div class="formContainer">
        <LoginSection />
        <SignupLink />
      </div>
    </div>
  );
}

export default Register;
