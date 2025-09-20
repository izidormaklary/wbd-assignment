import { FaSpinner } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="flex justify-center items-center animate-pulse h-64 bg-white rounded-md shadow-md">
      <FaSpinner className="animate-spin  text-2xl opacity-80 " />
    </div>
  );
}
