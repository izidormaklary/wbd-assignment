import { useState } from "react";
import DateRange from "../inputs/DateRange";
import Card from "../layout/Card";
import Button from "../inputs/Button";

export default function AnalyticsHeader({
  onRefresh,
  before,
  after,
}: {
  onRefresh: (dateRange: { start: string; end: string }) => void;
  before?: string;
  after?: string;
}) {
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const handleRefresh = () => {
    onRefresh(dateRange);
    setDateRange({ start: "", end: "" });
  };
  return (
    <Card className="flex flex-col gap-4 items-start">
      <div className="flex flex-row gap-4 items-end">
        <h1 className="text-2xl font-bold">Global Analytics</h1>
        <span className="text-sm text-gray-500">
          {before || after ? `${after} - ${before}` : "All time"}
        </span>
      </div>
      <div className="flex flex-row w-full justify-between">
        <DateRange
          start={dateRange.start}
          end={dateRange.end}
          onChange={(start, end) => setDateRange({ start, end })}
        />
        <Button
          label="refresh"
          onClick={handleRefresh}
          disabled={!dateRange.start && !dateRange.end}
        />
      </div>
    </Card>
  );
}
