import React from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

function LineChart(props) {
  const { labels, datapoints, curStock, color } = props;
  // sets up the correct styling for the graph
  const data = {
    labels: labels,
    datasets: [
      {
        label: curStock,
        data: datapoints,
        borderColor: color,
        fill: false,
        pointRadius: 0,
      }
    ]
  };
  // Allows for responsive chart regardless of y location of curser
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "TODO" + " Stock Chart"
      },
      tooltip: {
        mode: "index",
        intersect: false
      }
    }
  }
  
  return <Line data={data} options={options} />;
}

export default LineChart;
