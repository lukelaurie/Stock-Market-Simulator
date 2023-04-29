import "../../styles/loginStyle.css";

function RegisterInput() {
  return (
    <div>
        <label for="email">
            <b>Email</b>
          </label>
          <input
            type="text"
            placeholder="Enter Email"
            id="email"
            name="email"
            required
            className="inputLogin"
          />

          <label for="newUsername">
            <b>Username</b>
          </label>
          <input
            type="text"
            placeholder="Enter Username"
            id="newUsername"
            name="username"
            required
            className="inputLogin"
          />

          <label for="phoneNumber">
            <b>Phone Number</b>
          </label>
          <input
            type="text"
            pattern="([0-9]{3})[0-9]{3}-[0-9]{4}"
            placeholder="Enter Phone Number (xxx)xxx-xxxx"
            id="phoneNumber"
            name="phoneNumber"
            required
            className="inputLogin"
          />

          <label for="newPsw">
            <b>Password</b>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            id="newPsw"
            name="password"
            required
            className="inputLogin"
          />

          <label for="newPswRepeat">
            <b>Repeat Password</b>
          </label>
          <input
            type="password"
            placeholder="Repeat Password"
            id="newPswRepeat"
            name="secondPassword"
            required
            className="inputLogin"
          />
    </div>
  );
}

export default RegisterInput;
