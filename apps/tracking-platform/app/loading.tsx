import { FaSpinner } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <FaSpinner className="animate-spin" />
    </div>
  );
}
