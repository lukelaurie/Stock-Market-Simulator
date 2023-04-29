import React from 'react';
import { useEffect, useState } from "react";
import LineChart from './LineChart';
import { graphInfo } from "../../utils/search";



function StockChart(props) {
  // initialzies the needed data
  const [datapoints, setStockData] = useState([]);
  const [labels, setStockLabels] = useState([]);
  const [color, setStockColor] = useState([]);
  const title = props.stockTicker;
  // gets the data for the searched stock
  useEffect(() => {
    chartInfo(title, props.time); 
  }, [title, props.time]);
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
