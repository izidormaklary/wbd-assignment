import { KeyboardEvent } from "react";

interface StringSearchProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export default function StringSearch({
  placeholder,
  value,
  onChange,
  onKeyDown,
}: StringSearchProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      className="border border-gray-300 rounded-full p-2"
    />
  );
}
