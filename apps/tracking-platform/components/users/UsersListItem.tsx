import { FiExternalLink } from "react-icons/fi";
import { countryCodeToEmoji } from "../../utils/countryCodeToEmoji";
import { ellipseString } from "../../utils/ellipseString";
import Link from "next/link";

export default function UsersListItem({
  name,
  email,
  country,
  _id,
}: {
  name: string;
  email: string;
  country: string;
  _id: string;
}) {
  return (
    <Link
      href={`/users/${_id}`}
      className="grid grid-cols-10 border-[0.5] border-gray-200 rounded-sm shadow-xs p-2 hover:bg-gray-100 cursor-pointer"
    >
      <span className="col-span-2">{ellipseString(_id, 12, true)}</span>
      <span className="col-span-3">{ellipseString(name, 16, true)}</span>
      <span className="col-span-3">{email}</span>
      <span className=" text-center">{countryCodeToEmoji(country)}</span>
      <button className="flex justify-end items-center">
        <FiExternalLink />
      </button>
    </Link>
  );
}
