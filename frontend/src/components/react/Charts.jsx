const data = {
  labels: ["Red", "Orange", "Blue"],
  // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
  datasets: [
    {
      label: "Popularity of colours",
      data: [55, 23, 96],
      // you can set indiviual colors for each bar
      backgroundColor: [
        "rgba(255, 255, 255, 0.6)",
        "rgba(255, 255, 255, 0.6)",
        "rgba(255, 255, 255, 0.6)",
      ],
      borderWidth: 1,
    },
  ],
};

// App.js
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useState } from "react";
import { Data } from "../../utils/data.js";
import PieChart from "./charts/PieChart.jsx";
import { BarChart } from "./charts/BarChart.jsx";
import LineChart from "./charts/LineChart.jsx";
import { charts } from "../../utils/chartStore.js";
import { useStore } from "@nanostores/react";

Chart.register(CategoryScale);

export default function Charts() {
  const [chartData, setChartData] = useState({
    labels: Data.map((data) => data.year),
    datasets: [
      {
        label: "Sessions",
        data: Data.map((data) => data.userGain),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  const $charts = useStore(charts);

  return (
    <div className="App">
      {$charts === "bd" ? (
        <BarChart chartData={chartData} />
      ) : (
        <LineChart chartData={chartData} />
      )}

      {/* <PieChart chartData={chartData} /> */}
    </div>
  );
}
