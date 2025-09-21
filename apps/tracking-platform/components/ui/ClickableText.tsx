export default function ClickableText({
  text,
  onClick,
  icon,
  className,
}: {
  text: string;
  onClick: () => void;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-row gap-2  items-center cursor-pointer ${className}`}
      onClick={onClick}
    >
      {text}
      {icon}
    </div>
  );
}
