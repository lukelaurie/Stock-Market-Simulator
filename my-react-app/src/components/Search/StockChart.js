import React from 'react';
import { useEffect, useState } from "react";
import LineChart from './LineChart';
import { graphInfo } from "../../utils/search";



function StockChart(props) {
  const [datapoints, setStockData] = useState([]);
  const [labels, setStockLabels] = useState([]);
  const [color, setStockColor] = useState([]);
  // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  // const datapoints = [100, 200, 300, 400, 500, 600, 700];
  const title = 'WMT';

  // gets the data for the saerched stock
  useEffect(() => {
    chartInfo(title, "fiveYear"); 
  }, []);
  // gets the daily change of the stock
  const chartInfo = (ticker, time) => {
    graphInfo(time, ticker)
      .then((data) => {
        // sets the correct data to each of the vars
        setStockData(data.datapoints);
        setStockLabels(data.labels);
        setStockColor(data.color);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div>
      <LineChart labels={labels} datapoints={datapoints} curStock={title} color={color} />
    </div>
  );
};

export default StockChart;
