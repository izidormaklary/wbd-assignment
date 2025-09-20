export default function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`bg-white rounded-md shadow-md p-4 border-gray-200 border-[0.5] ${className}`}
    >
      {children}
    </div>
  );
}
