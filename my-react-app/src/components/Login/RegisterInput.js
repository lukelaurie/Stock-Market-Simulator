import "../../styles/loginStyle.css";


function RegisterInput({onChange}) {
  return (
    <div>
        <label htmlFor="email">
            <b>Email</b>
          </label>
          <input
            type="text"
            placeholder="Enter Email"
            id="email"
            name="email"
            required
            className="inputLogin"
            onChange={onChange}
          />

          <label htmlFor="newUsername">
            <b>Username</b>
          </label>
          <input
            type="text"
            placeholder="Enter Username"
            id="newUsername"
            name="username"
            required
            className="inputLogin"
            onChange={onChange}
          />

          <label htmlFor="phoneNumber">
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
            onChange={onChange}
          />

          <label htmlFor="newPsw">
            <b>Password</b>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            id="newPsw"
            name="password"
            required
            className="inputLogin"
            onChange={onChange}
          />

          <label htmlFor="newPswRepeat">
            <b>Repeat Password</b>
          </label>
          <input
            type="password"
            placeholder="Repeat Password"
            id="newPswRepeat"
            name="secondPassword"
            required
            className="inputLogin"
            onChange={onChange}
          />
    </div>
  );
}

export default RegisterInput;
