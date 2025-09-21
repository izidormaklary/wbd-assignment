import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function PageAvgTimeChart({
  pageViews,
}: {
  pageViews: { page: string; avgTime: number }[];
}) {
  return (
    <div className="w-full h-[400px]">
      <h3 className="text-lg font-semibold mb-4">
        Average Time Spent (seconds)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={pageViews}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="page" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="avgTime" fill="#2f496d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
