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
          <div className="w-full flex flex-row gap-2">
            <PageViewsChart
              pageViews={analytics.pageViews.map((pageView) => ({
                page: pageView._id,
                visits: pageView.count,
              }))}
            />
            <PageAvgTimeChart
              pageViews={analytics.pageViews.map((pageView) => ({
                page: pageView._id,
                avgTime: pageView.avgTimeSpent,
              }))}
            />
          </div>
        )}
        {selected === "events" && (
          <EventCountsComparisonChart
            eventCounts={Object.keys(globalAnalytics.events).map((event) => ({
              event: event,
              user: analytics.events[event]?.count ?? 0,
              globalAvg:
                globalAnalytics.events[event]!.count /
                globalAnalytics.totalUsers,
            }))}
          />
        )}
      </div>
    </Card>
  );
}
