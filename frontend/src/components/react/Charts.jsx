import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useState, useEffect } from "react";
import PieChart from "./charts/PieChart.jsx";
import { BarChart } from "./charts/BarChart.jsx";
import LineChart from "./charts/LineChart.jsx";
import { charts } from "../../utils/chartStore.js";
import { useStore } from "@nanostores/react";
import {
  dates,
  domainSelection,
  getDataInRangeNew,
  gewerkSelection,
  unterGewerkSelection,
  productOwnerSelection,
} from "../../utils/dataStore.js";
import { aggregatedMethod } from "../../utils/dataStore.js";

Chart.register(CategoryScale);

export default function Charts({ initialData }) {
  const [chartData, setChartData] = useState({
    labels: initialData.map((data) => data.name),
    datasets: [
      {
        label: "Sessions",
        data: initialData.map((data) => data.clicks),
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
  const $dates = useStore(dates);
  const $aggregatedMethod = useStore(aggregatedMethod);
  const $domainSelection = useStore(domainSelection);
  const $gewerkSelection = useStore(gewerkSelection);
  const $unterGewerkSelection = useStore(unterGewerkSelection);
  const $productOwnerSelection = useStore(productOwnerSelection);

  useEffect(() => {
    getDataInRangeNew(
      $dates,
      $aggregatedMethod,
      $domainSelection,
      $productOwnerSelection,
      $gewerkSelection,
      $unterGewerkSelection
    ).then((newData) =>
      setChartData({
        labels: newData.map((data) => data.name),
        datasets: [
          {
            label: "Sessions",
            data: newData.map((data) => data.clicks),
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
      })
    );
  }, [
    $dates,
    $aggregatedMethod,
    $domainSelection,
    $gewerkSelection,
    $unterGewerkSelection,
    $productOwnerSelection,
  ]);

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
