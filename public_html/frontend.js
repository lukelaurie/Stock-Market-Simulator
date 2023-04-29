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

    fetch ("api/users/summary", {
        method: "GET"
    })
    .then(response => {
        return response.json();
    })
    .then ((data) => {


        var accountValue = 0;
        let holdings = data.holdings;
        var cashBalance = data.cashBalance;

        // Create the row in the summary table to store relevant data, and initianlize values
        let summary = document.getElementById("summary");
        const summRow = document.createElement("tr");
        const totalValue = document.createElement("td");
        totalValue.id = "totalValue";
        totalValue.innerText = "0";
        const totalGain = document.createElement("td");
        totalGain.id = "totalGain";
        totalGain.innerText = "0";
        const buyingPower = document.createElement("td");
        buyingPower.id = "buyingPower";
        buyingPower.innerText = "$" + cashBalance.toString();

        summRow.appendChild(totalValue);
        summRow.appendChild(totalGain);
        summRow.appendChild(buyingPower);

        summary.appendChild(summRow);

        // Loop over each holding and add it to the table. Also update summary totals
        for (i = 0; i < holdings.length; i++) {

            let table = document.getElementById("stockTable");
            let holding = holdings[i];
            let sym = holding.symbol;
            let shares = holding.shares;
            let averagePrice = holding.averagePrice;

            const stockRow = document.createElement("tr");
            // Create new cell elements and set their values
            const symbol = document.createElement("td");
            const name = document.createElement("td");
            const quantity = document.createElement("td");
            const price = document.createElement("td");
            const dailyChange = document.createElement("td");
            const gain = document.createElement("td");
            // gets the name of the stock
            fetch("/api/stock/fullname/" + sym)
              .then((nameResponce) => {
                return nameResponce.text();
              })
              .then((nameToDisplay) => {
                console.log(nameToDisplay);
                fetch("/api/stock/day/" + sym)
                  .then((priceResponce) => {
                    return priceResponce.json();
                  })
                  .then((priceToDisplay) => {

                    // sets the ticker link 
                    const tickerLink = document.createElement("a");
                    tickerLink.innerText = sym;
                    tickerLink.setAttribute("href", "./search.html?search=" + sym);
                    // sets the values of the row
                    symbol.appendChild(tickerLink);
                    name.innerText = nameToDisplay;
                    quantity.innerText = shares;
                    price.innerText = "$" + priceToDisplay["c"];
                    dailyChange.innerText = "$" + priceToDisplay["d"] + " (" + priceToDisplay["dp"] + "%)";
                    dailyChange.style.color = priceToDisplay["d"] > 0 ? "green" : "red";
                    gain.innerText = "$" + (priceToDisplay["c"] - averagePrice) * shares;
                    // Add the new cell elements to the new row element
                    stockRow.appendChild(symbol);
                    stockRow.appendChild(name);
                    stockRow.appendChild(quantity);
                    stockRow.appendChild(price);
                    stockRow.appendChild(dailyChange);
                    stockRow.appendChild(gain);
                    // Add the new row element to the table
                    table.appendChild(stockRow);

                    // Update the summary totals
                    val = Number(totalValue.innerText.substring(1)) + (priceToDisplay["c"] * shares);
                    console.log(val);
                    totalValue.innerText = "$" + val.toString();
                    totalGain.innerText = "$" + ((cashBalance + Number(totalValue.innerText.substring(1))- 10000)).toString();
                    totalGain.style.color = Number(totalGain.innerText.substring(1)) > 0 ? "green" : "red";
                  });
              })
              .catch((err) => {
                console.log(err);
              });
        }
    })
    .catch((error) => {
        console.log(error);
    });
}

/*
    This function is called when the user navigates to the profile.html page. It populates the page
    with the user's information from the database
*/
function loadProfile() {

    fetch ("api/users/summary", {
        method: "GET"
    })
    .then(response => {
        return response.json();
    })
    .then ((data) => {
        console.log(data);
        document.getElementById("usernameInfo").innerText = "Username: " + data.username;
        document.getElementById("emailInfo").innerText = "Email: " + data.email;
        document.getElementById("phoneInfo").innerText = "Phone Number: " + data.phoneNumber;
        document.getElementById("balanceInfo").innerText = "Current Balance: $" + data.cashBalance;
    })
    .catch((error) => {
        console.log(error);
    });

}

/*
    This function allows a user to buy shares of a stock by pressing the button
*/
function buyShares() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const stockTicker = urlParams.get("search");
    fetch("/api/stock/day/" + stockTicker)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(document.getElementById("shares").value);
        console.log(data["c"]);
        console.log(stockTicker);
        fetch("/api/users/portfolio/buy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    symbol: stockTicker,
                    shares: document.getElementById("shares").value,
                    price: data["c"]
                })
        });
    })
    .catch((error) => {
        console.log(error);
    });

}