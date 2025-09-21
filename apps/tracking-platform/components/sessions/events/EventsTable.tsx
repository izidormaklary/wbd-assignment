import { FiCopy } from "react-icons/fi";
import { ellipseString } from "../../../utils/ellipseString";
import ClickableText from "../../ui/ClickableText";

interface Event {
  _id: string;
  sessionId: string;
  type: "search" | "page_view" | "add_to_cart" | "upsell" | "checkout";
  page?: string;
  timestamp: string;
  metadata?: object;
}

interface EventsTableProps {
  events: Event[];
}

export default function EventsTable({ events }: EventsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-4">
      {events.length === 0 ? (
        <div className="text-center py-8 ">No events found</div>
      ) : (
        <div className="space-y-0">
          <div className="grid grid-cols-6 gap-4 p-2 font-semibold text-sm  border-b">
            <p className="col-span-2 font-bold">timestamp</p>
            <p className="col-span-1 font-bold">type</p>
            <p className="col-span-1 font-bold">page</p>
            <p className="col-span-2 font-bold">metadata</p>
          </div>
          {events.map((event: Event) => (
            <div
              key={event._id}
              className="grid grid-cols-6 text-sm gap-4 p-4 even:bg-gray-100 "
            >
              <p className="col-span-2">{formatDate(event.timestamp)}</p>
              <p className="col-span-1">{event.type}</p>
              <p className="col-span-1">{event.page}</p>
              <div className="col-span-2">
                <ClickableText
                  text={ellipseString(JSON.stringify(event.metadata), 20, true)}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      JSON.stringify(event.metadata)
                    );
                  }}
                  icon={<FiCopy />}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
