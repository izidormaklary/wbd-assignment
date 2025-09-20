import Loading from "../layout/Loading";
import UsersListItem from "./UsersListItem";
import { useEffect, useRef } from "react";

export default function UsersList({
  data,
  isLoading,
  error,
  hasNextPage,
  loadMore,
}: {
  data: any;
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
  const users = data.users as {
    _id: string;
    name: string;
    email: string;
    country: string;
  }[];
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="flex flex-col  bg-white p-4 rounded-md shadow-md justify-stretch">
      {users.length === 0 ? (
        <div className="text-center">No users found</div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-10 p-2">
            <p className="col-span-2 font-bold">id</p>
            <p className="col-span-3 font-bold">name</p>
            <p className="col-span-3 font-bold">email</p>
            <p className="font-bold text-center">country</p>
            <p></p>
          </div>
          <div className="border-b -mx-2 border-gray-200"></div>
          {users.map((user) => (
            <UsersListItem key={user._id} {...user} />
          ))}
        </div>
      )}
      {hasNextPage && (
        <div
          className=" -mt-60 pt-64 w-full animate-pulse text-center"
          ref={ref}
        >
          {" "}
          loading more ...{" "}
        </div>
      )}
    </div>
  );
}
