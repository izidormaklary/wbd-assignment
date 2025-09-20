import { Chart } from "react-google-charts";
export default function PageViewsChart({
  pageViews,
}: {
  pageViews: [string, number][];
}) {
  return (
    <Chart
      chartType="ColumnChart"
      data={[["Page", "visits"], ...pageViews]}
      options={{ title: "Page Views", width: 800, legend: { position: "top" } }}
    />
  );
}
