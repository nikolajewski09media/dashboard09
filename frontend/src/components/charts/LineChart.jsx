import React from "react";
import { Line } from "react-chartjs-2";
function LineChart({ chartData }) {
  return (
    <div className="chart-container max-w-4xl">
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: false,
              text: "Linechart Sessions",
            },
            legend: {
              display: false,
            },
          },
        }}
      />
    </div>
  );
}
export default LineChart;
