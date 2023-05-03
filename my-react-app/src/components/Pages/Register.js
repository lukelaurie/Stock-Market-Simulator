/**
 * This is a reusable component which puts together all 
 * of the componets that makes up the register page so that 
 * the user can create a new user whenever.
 */
import "../../styles/loginStyle.css";
import RegisterInput from "../Login/RegisterInput";
import RegisterButtons from "../Login/RegisterButtons";
import { useEffect, useState } from "react";

function Register() {
  const [formData, setFormData] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };
  const createUser = () => {
    // Check if the passwords match
    if (formData.password !== formData.secondPassword) {
      alert("Passwords do not match");
      return;
    }

    fetch("http://157.230.181.102:8080/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        console.log(data);
        if (data == "UEXISTS") {
          alert("Username already exists");
        } else if (data == "PEXISTS") {
          alert("Phone number already exists");
        } else if (data == "EEXISTS") {
          alert("Email already exists");
        } else if (data == "OKAY") {
          // swaps to page where can login
          alert("Registration successful");
          window.location.href = "/login";
        } else {
          alert("Registration failed");
        }
      });
  };

  return (
    <div id="id01" className="modal">
      <div className="modal-content">
        <div className="container">
          <h1>Sign Up</h1>
          <RegisterInput onChange={handleInputChange} />
          <RegisterButtons createUser={createUser} />
        </div>
      </div>
    </div>
  );
}

export default Register;
