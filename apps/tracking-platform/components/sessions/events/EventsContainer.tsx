import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import EventsGraph from "./EventsGraph";
import EventsJson from "./EventsJson";
import EventsTable from "./EventsTable";
import HorizontalToggle from "../../ui/HorizontalToggle";

interface EventsContainerProps {
  sessionId: string;
}

interface Event {
  _id: string;
  sessionId: string;
  type: "search" | "page_view" | "add_to_cart" | "upsell" | "checkout";
  page?: string;
  timestamp: string;
}

export default function EventsContainer({ sessionId }: EventsContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "graph" | "json">("graph");

  const { data, isLoading, error } = useQuery({
    queryKey: ["session-events", sessionId],
    queryFn: () =>
      fetch(`/api/sessions/${sessionId}/events`).then((res) => res.json()),
  });

  const events: Event[] = data?.events || [];

  return (
    <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
      <HorizontalToggle
        options={["graph", "json", "table"] as const}
        selected={viewMode}
        onSelect={(selected) => setViewMode(selected)}
      />
      {viewMode === "graph" && <EventsGraph events={events} />}
      {viewMode === "json" && <EventsJson events={events} />}
      {viewMode === "table" && <EventsTable events={events} />}
    </div>
  );
}
