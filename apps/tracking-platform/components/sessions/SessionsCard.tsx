import { useEffect, useState } from "react";
import Card from "../layout/Card";
import SessionsList from "./SessionsList";
import { useQuery } from "@tanstack/react-query";

export default function SessionsCard({ userId }: { userId: string }) {
  const [allSessions, setAllSessions] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["sessions", userId, cursor],
    queryFn: () => {
      const params = new URLSearchParams();
      if (cursor) params.append("cursor", cursor);
      params.append("limit", "10");

      return fetch(`/api/users/${userId}/sessions?${params}`).then((res) =>
        res.json()
      );
    },
  });
  const handleLoadMoreSessions = () => {
    if (data?.nextCursor) {
      setCursor(data.nextCursor);
    }
  };
  useEffect(() => {
    if (data?.sessions) {
      setAllSessions(data.sessions);
    }
  }, [data]);

  return (
    <Card className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Sessions</h1>
      <SessionsList
        sessions={allSessions}
        isLoading={isLoading}
        error={isError}
        hasNextPage={data?.hasNextPage}
        loadMore={handleLoadMoreSessions}
      />
    </Card>
  );
}
