import EventCountGlobalChart from "../charts/EventCountGlobalChart";
import Card from "../layout/Card";
import Loading from "../layout/Loading";
/*
{
  "totalUsers": 3,
  "totalSessions": 3,
  "avgSessionDuration": null,
  "events": {
    "search": {
      "count": 1,
      "avgTimeSpent": 0
    },
    "page_view": {
      "count": 3,
      "avgTimeSpent": 21.333333333333332
    },
    "add_to_cart": {
      "count": 1,
      "avgTimeSpent": 0
    },
    "upsell": {
      "count": 0,
      "avgTimeSpent": 0
    },
    "checkout": {
      "count": 1,
      "avgTimeSpent": 0
    }
  },
  "pageViews": [
    {
      "_id": "/home",
      "count": 1,
      "avgTimeSpent": 15
    },
    {
      "_id": "/checkout",
      "count": 1,
      "avgTimeSpent": 7
    },
    {
      "_id": "/products",
      "count": 1,
      "avgTimeSpent": 42
    }
  ],
  "dateRange": {}
}
  */
export default function AnalyticsOverview({
  data,
  isLoading,
  error,
}: {
  data: {
    totalUsers: number;
    totalSessions: number;
    avgSessionDuration: number;
    events: {
      [key: string]: {
        count: number;
        avgTimeSpent: number;
      };
    };
    pageViews: any;
    dateRange: { start: string; end: string };
  };
  isLoading: boolean;
  error: any;
}) {
  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <Card className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Overview</h1>
      <div className="flex flex-row gap-4 justify-between">
        <span className="text-2xl font-bold">{data.totalUsers} Users</span>
        <span className="text-2xl font-bold">
          {data.totalSessions} Sessions
        </span>
        <span className="text-2xl font-bold">
          Conversion Rate:{" "}
          {data.events.checkout
            ? Math.round(
                (data.events.checkout.count / data.totalSessions) * 100 * 100
              ) / 100
            : 0}
          %
        </span>
      </div>
      <EventCountGlobalChart
        eventCounts={Object.entries(data.events).map(([event, count]) => ({
          event,
          globalAvg: count.count,
        }))}
      />
    </Card>
  );
}
