import { Chart } from "react-google-charts";

export default function PageAvgTimeChart({
  pageViews,
}: {
  pageViews: [string, number][];
}) {
  return (
    <Chart
      chartType="ColumnChart"
      data={[["Page", "avg. time spent in seconds"], ...pageViews]}
      options={{
        width: 800,
        height: 200,
        colors: ["#2f496d"],
        legend: { position: "top" },
      }}
    />
  );
}
