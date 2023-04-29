/*
 * This will run the needed frontend code to make the search
 * stock page interactive. For example it will display to the
 * user an interactive graph based on a time interval of their
 * choosing
 * Author: Luke Laurie
 * Date: 4/8/2023
 */
/*
 * This will get all of the needed data for a graph on its
 * correct time interval.
 * @param {String} timeAmount is the period of time to collect data.
 * @param {String} stock is the symbol representing the stock.
 */
function graphInfo(timeAmount, stock) {
  // makes a post requst to the server
  return fetch("http://localhost/api/date/daily/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ date: timeAmount, symbol: stock }),
  })
    .then((responce) => {
      return responce.json();
    })
    .then((curData) => {
      // draws the graph if data was found
      if (Object.keys(curData).length > 1) {
        
        return getGraphInfo(curData, stock, timeAmount);
      } else {
        alert("Choose A Valid Stock Ticker");
      }
    })
    .catch((err) => {
      alert("Choose A Valid Stock Ticker");
    });
}

/*
 * This will draw the graph based on an inputted set of data, and it
 * will provide the needed styling to the graph as well.
 * @param {Object} data is the container for all of the stock data.
 * @param {String} curStock is the symbol representing the stock.
 * @param {String} timeAmount is the period of time to collect data.
 */
function getGraphInfo(data, curStock, timeAmount) {
  // // destroys the chart if already existing
  // if (chart != "") {
  //   chart.destroy();
  // }
  // const ctx = canvas.getContext("2d");
  // format for the date
  const red = "rgb(255, 0, 0)";
  const green = "rgb(0, 128, 0)";
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };
  // removes the incorrect data points
  let labels = data["t"].map((item) => {
    // formats the date correctly
    let curDate = new Date(item * 1000);
    const formattedDate = curDate.toLocaleString("en-US", options);
    return formattedDate;
  });
  let datapoints = data["c"];
  // determines if stock is positive or negative
  if (Number(datapoints[0]) > Number(datapoints[datapoints.length - 1])) {
    var color = red;
  } else {
    var color = green;
  }

  const retVal = {
    labels: labels,
    datapoints: datapoints,
    color: color,
  };
  return retVal;
}

// /*
//  * This will run the code to display the correct graph and information in the table
//  * when a user searches for a stock
//  */
// function pageLoad() {
//   const queryString = window.location.search;
//   const urlParams = new URLSearchParams(queryString);
//   const search = urlParams.get("search");
//   // gets the data for the day
//   todaysData(search);
// }

// /*
//  * This function updates the graph to the correct time period when the user selects a new one
//  * @param {String} timeAmount is the period of time to collect data.
//  */
// function changeGraph(timeAmount) {
//   const queryString = window.location.search;
//   const urlParams = new URLSearchParams(queryString);
//   const search = urlParams.get("search");
//   graphInfo(timeAmount, search);
// }

/*
 * This function gets all of the current days information for a stock.
 * @param {String} stockTicker is the symbol representing the stock.
 * @return {Object} the data containing the info for the day.
 */
function todaysData(stockTicker) {
  let url = "http://localhost/api/stock/day/" + stockTicker;
  // gets the days information
  return fetch(url)
    .then((responce) => {
      return responce.json();
    })
    .then((data) => {
      if (data["d"] == null) {
        alert("Choose A Valid Stock Ticker");
        return;
      }
      // updates the values of the DOM
      var priceStock = data["c"];
      // calculates stock performance for the day
      const openingPrice = data.o;
      const closingPrice = data.c;
      var changeStock = ((closingPrice - openingPrice) / openingPrice) * 100;
      changeStock = changeStock.toFixed(2).toString() + "%";
      const stockInfo = {
        priceStock: priceStock,
        changeStock: changeStock,
      };
      return stockInfo;
    })
    .catch((err) => {
      console.log(err);
    });
}

/*
 * This function gets all the prediction for a stock.
 * @param {String} stockTicker is the symbol representing the stock.
 * @return {String} the percentage prediction for the stock.
 */
function getPrediction(stockTicker) {
  let url = "http://localhost/api/prediction/" + stockTicker;
  // gets the days information
  return fetch(url)
    .then((responce) => {
      return responce.text();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
}

export { todaysData, getPrediction, graphInfo };
