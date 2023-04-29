import "../../styles/loginStyle.css";
import RegisterInput from "../Login/RegisterInput";
import RegisterButtons from "../Login/RegisterButtons";

function Register() {
  return (
    <div id="id01" className="modal">
      <div className="modal-content">
        <div className="container">
          <h1>Sign Up</h1>
          <RegisterInput />
          <RegisterButtons />
        </div>
      </div>
    </div>
  );
}

export default Register;
