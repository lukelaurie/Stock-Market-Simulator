import "../../styles/loginStyle.css";

function LoginSection() {
  return (
    <div class="form">
          <div class="container">
            <label for="uname">
              <b>Username</b>
            </label>
            <input
              type="text"
              placeholder="Enter Username"
              name="username"
              id="uname"
              className="inputLogin"
            />

            <label for="psw">
              <b>Password</b>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              id="psw"
              className="inputLogin"
            />

            <button onclick="login()" className="loginButton">Login</button>
          </div>
        </div>
  );
}

export default LoginSection;
