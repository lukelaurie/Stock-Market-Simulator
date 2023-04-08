
graphInfo("fiveYear", "IBM");


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

function drawGraph(data, curStock) {
  const ctx = document.getElementById("myChart").getContext("2d");
  // the information to be displayed on the graph
  let labels = Object.keys(data).sort();
  let datapoints = Object.values(data)
    .map((item) => item["4. close"])
    .reverse();
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
