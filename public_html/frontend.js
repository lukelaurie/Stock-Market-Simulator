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

/*
    This function is called when the user clicks the register button on the login.html page. It
    sends the user's information to the server to be stored in the database.
*/
function register() {
    let username = document.getElementById("newUsername").value;
    let password = document.getElementById("newPsw").value;
    let confirmPassword = document.getElementById("newPswRepeat").value;
    let email = document.getElementById("email").value;
    let phoneNumber = document.getElementById("phoneNumber").value;

    // Check if the passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    let user = {
        username: username,
        password: password,
        email: email,
        phoneNumber: phoneNumber
    };

    fetch ("/api/register", {
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
        if (data == "UEXISTS") {
            alert("Username already exists");
        }
        else if (data == "PEXISTS") {
            alert("Phone number already exists");
        }
        else if (data == "EEXISTS") {
            alert("Email already exists");
        }
        else if (data == "OKAY") {
            alert("Registration successful");
            window.location.href = "/login.html"
        }
        else {
            alert("Registration failed");
        }
    });
}

/*
    This function is called when the user navigates to index.html. It populates the tables on that page
    with the information from the user's profile in the database
*/
function loadIndex() {

    var table = document.getElementById("summary");

    var row = table.insertRow();

    var cell1 = row.insertCell();
    var newText = document.createTextNode('new row');
    cell1.appendChild(newText);

    var cell2 = row.insertCell();
    var newText = document.createTextNode('new row');
    cell2.appendChild(newText);

    var cell3 = row.insertCell();
    var newText = document.createTextNode('new row');
    cell3.appendChild(newText);
    

}