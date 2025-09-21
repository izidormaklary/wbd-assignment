export default function HorizontalToggle<T extends string[]>({
  options,
  selected,
  onSelect,
}: {
  options: T;
  selected: T[number];
  onSelect: (selected: T[number]) => void;
}) {
  return (
    <div className="flex flex-row gap-24 text-sm justify-between bg-gray-300 inset-shadow-sm mx-auto rounded-full p-0.5">
      {options.map((item) => (
        <div
          key={item}
          className={` cursor-pointer  select-none flex flex-col items-center justify-center rounded-full transition-all  duration-300 p-0.5 px-5 ${selected === item ? "bg-white shadow-sm" : ""}`}
          onClick={() => onSelect(item)}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
