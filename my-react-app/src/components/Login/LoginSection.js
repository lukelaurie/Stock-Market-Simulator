import "../../styles/loginStyle.css";
import { useEffect, useState } from "react";

function LoginSection() {
  // keeps track of the username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    // make request to server here with username and password values
    let user = {
      username: username,
      password: password
  };
  fetch ("http://localhost/api/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
  })
  .then(response => {
      return response.text();
  })
  .then ((data) => {
      console.log(data);
      // checks if login was successful
      if (data === "OKAY") {
          console.log("Login successful");
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
      } else {
          alert("Invalid username or password");
      }
  });
  };
  return (
    <div className="form">
          <div className="container">
            <label htmlFor="uname">
              <b>Username</b>
            </label>
            <input
              type="text"
              placeholder="Enter Username"
              name="username"
              id="uname"
              className="inputLogin"
              onChange={handleUsernameChange}
            />

            <label htmlFor="psw">
              <b>Password</b>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              id="psw"
              className="inputLogin"
              onChange={handlePasswordChange}
            />

            <button onClick={handleLogin} className="loginButton">Login</button>
          </div>
        </div>
  );
}

export default LoginSection;
