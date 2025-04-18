import { fetchPostsCount, fetchUsersCount } from "@/app/lib/data";
import { DocumentTextIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export const CountPosts = async () => {
  const count = await fetchPostsCount();
  return <Card title="Posts" value={count} type="posts" />;
};

export const CountUsers = async () => {
  const count = await fetchUsersCount();
  return <Card title="Users" value={count} type="users" />;
};

const iconMap = {
  posts: DocumentTextIcon,
  users: UserGroupIcon,
};

function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: "posts" | "users";
}) {
  const Icon = iconMap[type];

  return (
    <div className="w-full rounded-lg border border-indigo-100 bg-white p-2 shadow-sm">
      <div className="flex items-center p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p className="truncate rounded-xl bg-indigo-50 px-4 py-8 text-center text-2xl">
        {value}
      </p>
    </div>
  );
}
