/*
 * This will make a call to the backend in order to determine
 * what the current top stock predictions are, so that the user
 * can have more recourses in choosing which stock to invest in.
 * Author: Luke Laurie
 * Date: 4/8/2023
 */

/*
 * This will get all of the top predictions for the stocks and it
 * will then display it in it scorrect table view.
 */
function getTopStocks() {
  return fetch("http://stocksimulator.me:8080/api/stock/top")
    .then((response) => response.json()) // parse the response body as JSON
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
}

export { getTopStocks }