import { useState } from "react";
import Card from "../layout/Card";
import HorizontalToggle from "../ui/HorizontalToggle";
import PageViewsChart from "../charts/PageViewsChart";
import PageAvgTimeChart from "../charts/PageAvgTimeChart";
import EventCountsComparisonChart from "../charts/EventCountsComparisonChart";

interface Analytics {
  userId: string;
  totalSessions: number;
  avgSessionDuration: number;
  avgTimeSpent: number;
  events: Record<string, { count: number; avgTimeSpent: number }>;
  pageViews: { _id: string; count: number; avgTimeSpent: number }[];
}

export default function UserAnalyticsCard({
  analytics,
  globalAnalytics,
}: {
  analytics: { userId: string } & Analytics;
  globalAnalytics: { totalUsers: number } & Analytics;
}) {
  const [selected, setSelected] = useState<"pages" | "events">("events");

  return (
    <Card>
      <h1 className="text-2xl  font-bold">User Analytics</h1>
      <div className="flex flex-col min-h-[450px] items-center  gap-2">
        <HorizontalToggle
          options={["events", "pages"] as const}
          selected={selected}
          onSelect={(value) => setSelected(value)}
        />
        {selected === "pages" && (
          <div className="flex flex-col items-center justify-center gap-2">
            <PageViewsChart
              pageViews={
                analytics.pageViews.map((pageView) => [
                  pageView._id,
                  pageView.count,
                ]) as [string, number][]
              }
            />
            <PageAvgTimeChart
              pageViews={
                analytics.pageViews.map((pageView) => [
                  pageView._id,
                  pageView.avgTimeSpent,
                ]) as [string, number][]
              }
            />
          </div>
        )}
        {selected === "events" && (
          <div className="flex flex-col items-center justify-center gap-2">
            <EventCountsComparisonChart
              eventCounts={
                Object.keys(globalAnalytics.events).map((event) => [
                  event,
                  analytics.events[event]?.count ?? 0,
                  globalAnalytics.events[event]!.count /
                    globalAnalytics.totalUsers,
                ]) as [string, number, number][]
              }
            />
          </div>
        )}
      </div>
    </Card>
  );
}
