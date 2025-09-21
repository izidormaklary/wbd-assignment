import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function EventCountsComparisonChart({
  eventCounts,
}: {
  eventCounts: {event: string, user: number, globalAvg: number}[];
}) {

  return (
    <div className="w-full h-[400px]">
      <h3 className="text-lg font-semibold mb-4">Event Counts Comparison</h3>
      <ResponsiveContainer minWidth="60%" height="100%">
        <BarChart
          data={eventCounts}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="event" 
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="globalAvg" fill="#8884d8" name="Global Average" />
          <Bar dataKey="user" fill="#2f496d" name="User" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
