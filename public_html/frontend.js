/*
    This file contains the code for the frontend pages of the stock simulation website
    Author: Jacob Chambers
*/

/*
    This function is called when the user clicks the login button on the login.html page
*/
function login() {
    let username = document.getElementById("uname").value;
    let password = document.getElementById("psw").value;

    let user = {
        username: username,
        password: password
    };

    fetch ("/api/login", {
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
        if (data === "OKAY") {
            console.log("Login successful");
            window.location.href = "/index.html"
        } else {
            alert("Invalid username or password");
        }
    });

}