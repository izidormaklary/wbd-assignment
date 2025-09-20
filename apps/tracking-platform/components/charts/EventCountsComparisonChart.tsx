import { Chart } from "react-google-charts";

export default function EventCountsComparisonChart({
  eventCounts,
}: {
  eventCounts: [event: string, user: number, globalAvg: number][];
}) {
  return (
    <Chart
      chartType="ColumnChart"
      data={[["Event", "User", "Global Average"], ...eventCounts]}
      options={{
        title: "Event Counts Comparison",
        width: 800,
        height: 400,
        legend: { position: "top" },
      }}
    />
  );
}
