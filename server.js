const express = require("express"); 
var request = require("request");

const app = express(); 

app.use(express.static("public_html")); 

// Replace `YOUR_API_KEY` with your Xignite API key
const apiKey = 'YOUR_API_KEY';

// Set the endpoint and parameters for the API call
const endpoint = 'https://globalrealtime.xignite.com/v3/xGlobalRealTime.json/GetRealTimeQuote';
const symbol = 'AAPL';

const url = `${endpoint}?_token=${apiKey}&IdentifierType=Symbol&Identifier=${symbol}`;

// Make the API call with Fetch API
fetch(url)
  .then(response => response.json())
  .then(quote => console.log(quote))
  .catch(error => console.error(error));

// request.get({
//     url: url,
//     json: true,
//     headers: {'User-Agent': 'request'}
//   }, (err, res, data) => {
//     if (err) {
//       console.log('Error:', err);
//     } else if (res.statusCode !== 200) {
//       console.log('Status:', res.statusCode);
//     } else {
//       // data is successfully parsed as a JSON object:
//       a = "Time Series (Daily)";
//       console.log(data["Time Series (Daily)"]['2022-11-10']);
//     }
// });



app.listen(3000, () => {
    console.log("Listening on port 3000");
})