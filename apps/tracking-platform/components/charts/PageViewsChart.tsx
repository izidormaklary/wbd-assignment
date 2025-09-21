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

export default function PageViewsChart({
  pageViews,
}: {
  pageViews: { page: string; visits: number }[];
}) {
  return (
    <div className="w-full h-[400px]">
      <h3 className="text-lg font-semibold mb-4">Page Views</h3>
      <ResponsiveContainer>
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
          <Bar dataKey="visits" fill="#2f496d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
