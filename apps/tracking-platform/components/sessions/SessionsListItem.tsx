import { useState } from "react";
import { FiChevronDown, FiCopy } from "react-icons/fi";
import ClickableText from "../ui/ClickableText";
import { ellipseString } from "../../utils/ellipseString";
import EventsContainer from "./events/EventsContainer";

interface SessionsListItemProps {
  _id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  device?: string;
}

export default function SessionsListItem({
  _id,
  userId,
  startTime,
  endTime,
  device,
}: SessionsListItemProps) {
  const [showEvents, setShowEvents] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getDuration = () => {
    if (!endTime) return "active";
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    return `${diffMins} min`;
  };

  const toggleEvents = () => {
    setShowEvents(!showEvents);
  };
  return (
    <div
      className="border rounded-sm border-gray-200 cursor-pointer"
      onClick={toggleEvents}
    >
      <div className="grid grid-cols-6 p-2 hover:bg-gray-50">
        <ClickableText
          className="col-span-1 text-blue-500"
          icon={<FiCopy />}
          text={ellipseString(_id, 8)}
          onClick={() => {
            navigator.clipboard.writeText(_id);
          }}
        />
        <p className="col-span-2 text-sm">{formatDate(startTime)}</p>
        <p className="col-span-1 text-sm text-center">{getDuration()}</p>
        <p className="col-span-1 text-sm text-center">{device || "-"}</p>
        <div className="col-span-1 flex cursor-pointer flex-row gap-1 items-center justify-end text-sm hover:text-blue-500 transition-colors">
          events
          <FiChevronDown
            className={`transition-transform duration-300 ${showEvents ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all cursor-auto duration-300 ease-in-out ${
          showEvents ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4">
          <EventsContainer sessionId={_id} />
        </div>
      </div>
    </div>
  );
}
