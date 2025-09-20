import SidebarItem from "./SidebarItem";
import { FiUser } from "react-icons/fi";
import { FiBarChart } from "react-icons/fi";
import Card from "../Card";
export default function Sidebar() {
  return (
    <Card className="flex flex-col gap-0 sticky top-2">
      <div className="flex flex-col gap-1 p-2">
        <p className="text-sm text-gray-500 p-0 m-0">customer tracking</p>
        <h1 className="font-semibold">Menu</h1>
      </div>
      {/* divider */}
      <div className="border-t  border-gray-300 my-2"></div>
      <SidebarItem
        path="/users"
        title="Users"
        subtitle="browse users"
        icon={<FiUser />}
      />
      <SidebarItem
        path="/analytics"
        title="Analytics"
        subtitle="data aggregations for overview"
        icon={<FiBarChart />}
      />
    </Card>
  );
}
