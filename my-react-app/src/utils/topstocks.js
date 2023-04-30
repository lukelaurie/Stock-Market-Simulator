/*
 * This will make a call to the backend in order to determine
 * what the current top stock predictions are, so that the user
 * can have more recourses in choosing which stock to invest in.
 * Author: Luke Laurie
 * Date: 4/8/2023
 */

// // gets the needed elements from the dom
// mainTable = document.getElementById("tablePrediction");
// loadMoreRow = document.getElementById("loadMoreRow");
// loadLink = loadMoreRow.children[0].children[0];
// // sets the needed global variables
// stockListings = [];
// stocksToShow = [];
// numberStocksToShow = 0;

/*
 * This will get all of the top predictions for the stocks and it
 * will then display it in it scorrect table view.
 */
function getTopStocks() {
  return fetch("http://localhost/api/stock/top")
    .then((response) => response.json()) // parse the response body as JSON
    .then((data) => {
      // stockListings = data;
      // stocksToShow = []; 
      return data;
      //displayInitialStocks();
    })
    .catch((error) => {
      console.error(error);
    });
}

// function displayInitialStocks() {
//   numberStocksToShow += 5;
//   for (
//     let i = numberStocksToShow - 5;
//     i < numberStocksToShow && i < stockListings.length;
//     i++
//   ) {
//     const stockTicker = stockListings[i][0];
//     const stockPrediction = stockListings[i][1];
//     // Create a new row element
//     const stockRow = document.createElement("tr");
//     // Create new cell elements and set their values
//     const symbol = document.createElement("td");
//     const name = document.createElement("td");
//     const prediction = document.createElement("td");
//     const price = document.createElement("td");
//     // gets the name of the stock
//     fetch("/api/stock/fullname/" + stockTicker)
//       .then((nameResponce) => {
//         return nameResponce.text();
//       })
//       .then((nameToDisplay) => {
//         fetch("/api/stock/day/" + stockTicker)
//           .then((priceResponce) => {
//             return priceResponce.json();
//           })
//           .then((priceToDisplay) => {
//             // sets the ticker link 
//             const tickerLink = document.createElement("a");
//             tickerLink.innerText = stockTicker;
//             tickerLink.setAttribute("href", "./search.html?search=" + stockTicker);
//             // sets the values of the row
//             symbol.appendChild(tickerLink);
//             name.innerText = nameToDisplay;
//             prediction.innerText = stockPrediction + "%";
//             price.innerText = "$" + priceToDisplay["c"];
//             // Add the new cell elements to the new row element
//             stockRow.appendChild(symbol);
//             stockRow.appendChild(name);
//             stockRow.appendChild(prediction);
//             stockRow.appendChild(price);
//             // adds the row to the table in its correct location
//             stocksToShow.push([stockRow, stockPrediction]);
//             setupTable();
//           });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }

// /*
//  * This will add the neccesary stocks onto the table 
//  * to be displayed.
//  */
// function setupTable() {
//   // checks if values can be added to the table
//   if (
//     stocksToShow.length == numberStocksToShow ||
//     stocksToShow.length == stockListings.length
//   ) {
//     // sort the stock
//     stocksToShow.sort((a, b) => b[1] - a[1]);
//     var rowCount = mainTable.rows.length;
//     // checks if link should be removed first
//     if (rowCount != 0) {
//       mainTable.deleteRow(rowCount - 1);
//     }
//     // adds rows to the table
//     for (i in stocksToShow) {
//       mainTable.appendChild(stocksToShow[i][0]);
//     }
//     mainTable.appendChild(loadMoreRow);
//   }
// }

// /*
//  * This will add 5 new stocks to the table whenever
//  * the moad more button is clicked.
//  */
// loadLink.addEventListener("click", () => {
//   displayInitialStocks();
// });

//getTopStocks();

export { getTopStocks }



// return fetch("http://localhost/api/stock/top")
//   .then((response) => response.json())
//   .then((data) => {
//     const requests = data.map((item) => {
//       const stockTicker = item[0];
//       return fetch("http://localhost/api/stock/fullname/" + stockTicker)
//         .then((nameResponse) => nameResponse.text())
//         .then((nameToDisplay) => {
//           return fetch("http://localhost/api/stock/day/" + stockTicker)
//             .then((priceResponse) => priceResponse.json())
//             .then((priceToDisplay) => {
//               const stockInfo = {
//                 stockSymbol: stockTicker,
//                 stockName: nameToDisplay,
//                 stockPrediction: item[1],
//                 stockPrice: priceToDisplay["c"],
//               };
//               return stockInfo;
//             });
//         });
//     });
//     return Promise.all(requests);
//   })
//   .then((results) => {
//     console.log(results);
//     // Do something with the array of stock info objects
//   })
//   .catch((error) => {
//     console.error(error);
//   });