import Link from "next/link";

export default function SidebarItem({
  title,
  subtitle,
  icon,
  path,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  path: string;
}) {
  return (
    <Link
      className="flex gap-2 p-2 w-full  hover:bg-gray-200 hover:cursor-pointer rounded-md"
      href={path}
    >
      <div className="flex pt-1 items-start">{icon}</div>
      <div className="flex flex-col gap-0.5">
        <p className=" align-top ">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </Link>
  );
}
