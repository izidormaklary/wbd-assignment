import Card from "../layout/Card";

export default function UserPageHeader({
  name,
  email,
  language,
  country,
}: {
  name?: string;
  email?: string;
  language?: string;
  country?: string;
}) {
  return (
    <Card className="flex flex-col gap-4 items-start justify-between">
      <h1 className="text-2xl font-bold">User</h1>
      <div className="flex flex-row w-full justify-between">
        <div className="">
          <p>name: {name || "-"}</p>
          <p>email: {email || "-"}</p>
        </div>
        <div className="text-right">
          <p>locale: {`${language}-${country}`}</p>
          <p>placeholder</p>
        </div>
      </div>
    </Card>
  );
}
