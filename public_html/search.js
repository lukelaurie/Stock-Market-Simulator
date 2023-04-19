/*
 * This will run the needed frontend code to make the search
 * stock page interactive. For example it will display to the
 * user an interactive graph based on a time interval of their
 * choosing
 * Author: Luke Laurie
 * Date: 4/8/2023
 */
const canvas = document.getElementById("myChart");
const graphButtons = document.getElementsByClassName("button");
chart = "";

function displayStock() {
  // gets the stock ticker
  const currentUrl = window.location.search;
  const stockTicker = currentUrl.split("=")[1];
}

/*
 * This will get all of the needed data for a graph on its
 * correct time interval.
 * @param {String} timeAmount is the period of time to collect data.
 * @param {String} stock is the symbol representing the stock.
 */
function graphInfo(timeAmount, stock) {
  // makes a post requst to the server
  fetch("/api/date/daily/", {
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
      if (Object.keys(curData).length != 0) {
        drawGraph(curData, stock, timeAmount);
      }
    });
  // .catch((err) => {
  //   console.log(err);
  // });
}

/*
 * This will draw the graph based on an inputted set of data, and it
 * will provide the needed styling to the graph as well.
 * @param {Object} data is the container for all of the stock data.
 * @param {String} curStock is the symbol representing the stock.
 * @param {String} timeAmount is the period of time to collect data.
 */
function drawGraph(data, curStock, timeAmount) {
  // determines the key to search for in the data
  if (timeAmount == "day" || timeAmount == "week" || timeAmount == "month") {
    var dataPicker = "4. close";
  } else {
    var dataPicker = "5. adjusted close";
  }
  // destroys the chart if already existing
  if (chart != "") {
    chart.destroy();
  }
  const ctx = canvas.getContext("2d");
  // the information to be displayed on the graph
  let labels = Object.keys(data).sort();
  let datapoints = Object.values(data)
    .map((item) => item[dataPicker])
    .reverse();
  // determines if stock is positive or negative
  if (Number(datapoints[0]) > Number(datapoints[datapoints.length - 1])) {
    var color = "rgb(255, 0, 0)";
  } else {
    var color = "rgb(0, 128, 0)";
  }
  // create the chart to be displayed
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: curStock,
          data: datapoints,
          borderColor: color,
          fill: false,
          pointRadius: 0,
        },
      ],
    },
    // Allows for responsive chart regardless of y location of curser
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: curStock + " Stock Chart",
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
    },
  });
}

/*
 * This will run the code to display the correct graph and information in the table
 * when a user searches for a stock
 */
function pageLoad() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const search = urlParams.get("search");
  graphInfo("day", search);

  // TODO: Populate the table with the data from the API
}

/*
 * This function updates the graph to the correct time period when the user selects a new one
 * @param {String} timeAmount is the period of time to collect data.
 */
function changeGraph(timeAmount) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const search = urlParams.get("search");
  graphInfo(timeAmount, search);
}
