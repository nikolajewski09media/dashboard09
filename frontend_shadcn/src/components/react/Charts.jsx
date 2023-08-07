import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useState, useEffect } from "react";
import PieChart from "@/components/charts/PieChart.jsx";
import { BarChart } from "@/components/charts/BarChart.jsx";
import LineChart from "@/components/charts/LineChart.jsx";
import { useStore } from "@nanostores/react";
import { dates, selectorStates, getDataInRangeNew } from "@/utils/dataStore";

Chart.register(CategoryScale);

export default function Charts(props) {
  const [chartData, setChartData] = useState({
    labels: props.initialData.map((data) => data.name),
    datasets: [
      {
        label: "Sessions",
        data: props.items.map((data) => data.clicks),
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
  const $dates = useStore(dates);
  const {
    diagramArt,
    aggregatedMethod,
    domainSelection,
    productOwnerSelection,
    gewerkSelection,
    unterGewerkSelection,
  } = useStore(selectorStates);

  useEffect(() => {
    const data = props.items;
    const newData = getDataInRangeNew(
      data,
      $dates,
      aggregatedMethod,
      domainSelection,
      productOwnerSelection,
      gewerkSelection,
      unterGewerkSelection
    );
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
    });
  }, [
    props.items,
    $dates,
    aggregatedMethod,
    domainSelection,
    gewerkSelection,
    unterGewerkSelection,
    productOwnerSelection,
  ]);

  return (
    <div className="App">
      {diagramArt === "bd" ? (
        <BarChart chartData={chartData} />
      ) : (
        <LineChart chartData={chartData} />
      )}

      {/* <PieChart chartData={chartData} /> */}
    </div>
  );
}
