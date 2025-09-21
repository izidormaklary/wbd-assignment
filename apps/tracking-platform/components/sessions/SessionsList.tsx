import { FiCopy } from "react-icons/fi";
import Loading from "../layout/Loading";
import ClickableText from "../ui/ClickableText";
import SessionsListItem from "./SessionsListItem";
import { useEffect, useRef } from "react";

export default function SessionsList({
  sessions,
  isLoading,
  error,
  hasNextPage,
  loadMore,
}: {
  sessions: any[];
  isLoading: boolean;
  error: any;
  hasNextPage: boolean;
  loadMore: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // load more if invisible div is in view using intersection observer
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasNextPage) {
          loadMore();
        }
      });
    });
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, loadMore, ref]);

  if (error)
    return (
      <div className="text-center bg-white p-4 rounded-md shadow-md">
        Error: {error.message}
      </div>
    );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className=" flex-col  justify-stretch">
      {sessions.length === 0 ? (
        <div className="text-center">No sessions found</div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-6 p-2">
            <p className="col-span-1 font-bold">id</p>
            <p className="col-span-2 font-bold">start time</p>
            <p className="col-span-1 font-bold text-center">duration</p>
            <p className="col-span-1 font-bold text-center">device</p>
          </div>
          <div className="border-b -mx-2 border-gray-200"></div>
          {sessions.map((session) => (
            <SessionsListItem key={session._id} {...session} />
          ))}
        </div>
      )}
      {hasNextPage && (
        <div
          className="-mt-60 pt-64 w-full animate-pulse text-center"
          ref={ref}
        >
          {" "}
          loading more ...{" "}
        </div>
      )}
    </div>
  );
}
