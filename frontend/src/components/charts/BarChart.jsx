import { Bar } from "react-chartjs-2";
export const BarChart = ({ chartData }) => {
  return (
    <div className="chart-container max-w-4xl">
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: false,
              text: "Barchart Sessions",
            },
            legend: {
              display: false,
            },
          },
          //   maintainAspectRatio: false,
        }}
        className={"h-48 md:h-72"}
      />
    </div>
  );
};
