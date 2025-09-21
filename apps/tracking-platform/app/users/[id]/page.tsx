"use client";
import { useQueries } from "@tanstack/react-query";
import UserPageHeader from "../../../components/user/UserPageHeader";
import Loading from "../../../components/layout/Loading";
import { use } from "react";
import UserAnalyticsCard from "../../../components/user/UserAnalyticsCard";
import SessionsCard from "../../../components/sessions/SessionsCard";

export default function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const results = useQueries({
    queries: [
      {
        queryKey: ["user", id],
        queryFn: () => fetch(`/api/users/${id}`).then((res) => res.json()),
      },
      {
        queryKey: ["analytics", id],
        queryFn: () => fetch(`/api/analytics/${id}`).then((res) => res.json()),
      },
      {
        queryKey: ["analytics", "global"],
        queryFn: () => fetch(`/api/analytics/global`).then((res) => res.json()),
      },
    ],
  });

  const user = results[0].data;
  const analytics = results[1].data;
  const globalAnalytics = results[2].data;
  if (results[0].isLoading || results[1].isLoading || results[2].isLoading)
    return <Loading />;
  if (results[0].isError || results[1].isError || results[2].isError)
    return <div>Error</div>;
  if (results[0].isError || results[1].isError || results[2].isError)
    return <div>Error</div>;
  return (
    <div className="flex flex-col items-stretch  gap-4">
      <UserPageHeader {...user} />
      <UserAnalyticsCard
        analytics={analytics}
        globalAnalytics={globalAnalytics}
      />
      <SessionsCard userId={id} />
    </div>
  );
}
