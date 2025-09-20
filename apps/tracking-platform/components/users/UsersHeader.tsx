"use client";
import { useState } from "react";
import StringSearch from "../inputs/StringSearch";
import Button from "../inputs/Button";
import DateRange from "../inputs/DateRange";
import Card from "../layout/Card";

interface UsersHeaderProps {
  onSearch?: (
    searchTerm: string,
    dateRange: { start: string; end: string }
  ) => void;
}

export default function UsersHeader({ onSearch }: UsersHeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm, dateRange);
      // Clear form after search
      setSearchTerm("");
      setDateRange({ start: "", end: "" });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Card className="flex flex-col gap-4 items-start justify-between">
      <h1 className="text-2xl font-bold">Search Users</h1>
      <div className="flex flex-row w-full justify-between">
        <div className="flex flex-row gap-2">
          <StringSearch
            placeholder="user id, name or email"
            value={searchTerm}
            onChange={setSearchTerm}
            onKeyDown={handleKeyPress}
          />
          <DateRange
            start={dateRange.start}
            end={dateRange.end}
            onChange={(start: string, end: string) =>
              setDateRange({ start, end })
            }
          />
        </div>
        <Button
          label="search"
          onClick={handleSearch}
          disabled={!searchTerm.trim() && !dateRange.start && !dateRange.end}
        />
      </div>
    </Card>
  );
}
