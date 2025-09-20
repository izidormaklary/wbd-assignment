

export default function DateRange({ start, end, onChange }: {
  start: string;
  end: string;
  onChange: (start: string, end: string) => void;
}) {
  return (
    <div className="flex flex-row gap-2 rounded-full border-1 border-gray-300 p-2">
      <input
        type="date"
        value={start}
        onChange={(e) => onChange(e.target.value, end)}
      />
      <input
        type="date"
        value={end}
        onChange={(e) => onChange(start, e.target.value)}
      />
    </div>
  );
}
