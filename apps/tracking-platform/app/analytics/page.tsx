"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import AnalyticsHeader from "../../components/analytics/AnalyticsHeader";
import AnalyticsOverview from "../../components/analytics/AnalyticsOverview";

export default function Analytics() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [before, setBefore] = useState<string | null>(
    searchParams.get("before")
  );
  const [after, setAfter] = useState<string | null>(searchParams.get("after"));

  // Update URL when date range changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (before) params.set("before", before);
    if (after) params.set("after", after);

    const newUrl = params.toString() ? `?${params.toString()}` : "/analytics";
    router.replace(newUrl, { scroll: false });
  }, [router, before, after]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics", before, after],
    queryFn: () => {
      const params = new URLSearchParams();
      if (before) params.append("before", before);
      if (after) params.append("after", after);
      params.append("limit", "10");

      return fetch(`/api/analytics/global?${params}`).then((res) => res.json());
    },
  });

  const onRefresh = (dateRange: { start: string; end: string }) => {
    setAfter(dateRange.start);
    setBefore(dateRange.end);
  };

  return (
    <div className="flex flex-col gap-4">
      <AnalyticsHeader
        before={before ?? undefined}
        after={after ?? undefined}
        onRefresh={onRefresh}
      />
      <AnalyticsOverview data={data} isLoading={isLoading} error={error} />
    </div>
  );
}
