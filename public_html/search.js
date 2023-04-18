/*
 * This will run the needed frontend code to make the search 
 * stock page interactive. For example it will display to the 
 * user an interactive graph based on a time interval of their 
 * choosing
 * Author: Luke Laurie
 * Date: 4/8/2023
 */

//graphInfo("day", "IBM");
//graphInfo("week", "WMT");
// graphInfo("month", "WMT");
// graphInfo("sixMonth", "WMT");
// graphInfo("year", "WMT");
// graphInfo("fiveYear", "ACRX");
// graphInfo("allTime", "AAPL");

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
        drawGraph(curData, stock);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

/*
 * This will draw the graph based on an inputted set of data, and it 
 * will provide the needed styling to the graph as well.
 * @param {Object} data is the container for all of the stock data.
 * @param {String} curStock is the symbol representing the stock.
 */
function drawGraph(data, curStock) {
  const ctx = document.getElementById("myChart").getContext("2d");
  // the information to be displayed on the graph
  let labels = Object.keys(data).sort();
  console.log(data);
  let datapoints = Object.values(data)
    .map((item) => item["5. adjusted close"])
    .reverse();
    console.log("here");
    for (i in datapoints) {
      if (i % 2 == 0) {
        console.log(datapoints[i]);
      }
    }
  // determines if stock is positive or negative 
  if (Number(datapoints[0]) > Number(datapoints[datapoints.length - 1])) {
    var color = "rgb(255, 0, 0)";
  } else {
    var color = "rgb(0, 128, 0)";
  }
  console.log(data[labels[0]]);
  // create the chart to be displayed
  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: curStock,
          data: datapoints,
          borderColor: color,
          fill: false,
          pointRadius: 0
        },
      ],
    },
    // Allows for responsive chart regardless of y location of curser
    options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: curStock + ' Stock Chart'
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          }
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
  const search = urlParams.get('search');
  graphInfo("week", search);

  // TODO: Populate the table with the data from the API
}

/*
 * This function updates the graph to the correct time period when the user selects a new one
 * @param {String} timeAmount is the period of time to collect data.
*/
function updateGraph(timeAmount) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const search = urlParams.get('search');
  graphInfo(timeAmount, search);
}
