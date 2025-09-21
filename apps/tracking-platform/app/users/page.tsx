"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import UsersHeader from "../../components/users/UsersHeader";
import UsersList from "../../components/users/UsersList";

export default function Users() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [cursor, setCursor] = useState<string | null>(
    searchParams.get("cursor")
  );
  const [before, setBefore] = useState<string | null>(
    searchParams.get("before")
  );
  const [after, setAfter] = useState<string | null>(searchParams.get("after"));
  const [allUsers, setAllUsers] = useState<any[]>([]);

  // Update URL when cursor changes (for pagination)
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    // if (cursor) params.set("cursor", cursor);
    if (before) params.set("before", before);
    if (after) params.set("after", after);

    const newUrl = params.toString() ? `?${params.toString()}` : "/users";
    router.replace(newUrl, { scroll: false });
  }, [cursor, router, search, before, after]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", search, cursor, before, after],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (cursor) params.append("cursor", cursor);
      if (before) params.append("before", before);
      if (after) params.append("after", after);
      params.append("limit", "10");

      return fetch(`/api/users?${params}`).then((res) => res.json());
    },
  });

  // Update users list when new data arrives
  useEffect(() => {
    if (data?.users) {
      if (cursor === null) {
        // First page - replace all users
        setAllUsers(data.users);
      } else {
        // Subsequent pages - append to existing users
        setAllUsers((prev) => [...prev, ...data.users]);
      }
    }
  }, [data?.users, cursor]);

  const handleLoadMore = () => {
    if (data?.nextCursor) {
      setCursor(data.nextCursor);
    }
  };

  const handleSearch = (
    searchTerm: string,
    dateRange: { start: string; end: string }
  ) => {
    setSearch(searchTerm);
    setAfter(dateRange.start || null);
    setBefore(dateRange.end || null);
    setCursor(null); // Reset pagination for new search
    setAllUsers([]); // Clear existing users
  };

  return (
    <div className="flex flex-col gap-4">
      <UsersHeader onSearch={handleSearch} />
      <UsersList
        data={{ users: allUsers, hasNextPage: data?.hasNextPage || false }}
        isLoading={isLoading}
        error={error}
        hasNextPage={data?.hasNextPage || false}
        loadMore={handleLoadMore}
      />
    </div>
  );
}
