import { FiCopy } from "react-icons/fi";

interface Event {
  _id: string;
  sessionId: string;
  type: "search" | "page_view" | "add_to_cart" | "upsell" | "checkout";
  page?: string;
  timestamp: string;
}

interface EventsJsonProps {
  events: Event[];
}

export default function EventsJson({ events }: EventsJsonProps) {
  const jsonString = JSON.stringify(events, null, 2);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonString);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h4 className="text-lg font-semibold">Raw Events Data</h4>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No events to display
        </div>
      ) : (
        <div className="relative bg-gray-900 text-green-400 rounded-md overflow-auto max-h-96">
          <button
            onClick={copyToClipboard}
            className="absolute cursor-pointer top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 text-green-400 hover:text-white rounded-md transition-colors z-10"
            title="copy json"
          >
            <FiCopy className="text-sm" />
          </button>
          <pre className="text-sm font-mono whitespace-pre-wrap p-4 pr-12">
            {jsonString}
          </pre>
        </div>
      )}
    </div>
  );
}
