"use client";

import Link from "next/link";
import { Button } from "./button";
import {
  DocumentTextIcon,
  HomeIcon,
  PencilSquareIcon,
  PlusIcon,
  PowerIcon,
  Squares2X2Icon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { deletePost } from "../lib/actions";

export const HomePageButton = () => {
  return (
    <Link href="/" as="/">
      <Button className="border bg-white text-indigo-500 shadow-sm hover:border-neutral-200 hover:bg-indigo-500 hover:text-white focus-visible:outline-indigo-500 active:bg-indigo-600">
        <HomeIcon className="h-7 w-7" />
      </Button>
    </Link>
  );
};

export const DashboardPageButton = () => {
  return (
    <Link href="/dashboard" as="/dashboard">
      <Button className="border bg-white text-indigo-500 shadow-sm hover:border-neutral-200 hover:bg-indigo-500 hover:text-white focus-visible:outline-indigo-500 active:bg-indigo-600">
        <Squares2X2Icon className="h-7 w-7" />
      </Button>
    </Link>
  );
};

export const PostsPageButton = () => {
  return (
    <Link href="/dashboard/posts" as="/dashboard/posts">
      <Button className="border bg-white text-indigo-500 shadow-sm hover:border-neutral-200 hover:bg-indigo-500 hover:text-white focus-visible:outline-indigo-500 active:bg-indigo-600">
        <DocumentTextIcon className="h-7 w-7" />
      </Button>
    </Link>
  );
};

export const LoginPageButton = () => {
  return (
    <Link href="/dashboard" as="/dashboard">
      <Button className="border border-neutral-200 bg-indigo-400 text-white shadow-sm hover:bg-indigo-900 focus-visible:outline-indigo-500 active:bg-indigo-600">
        <UserIcon className="h-7 w-7" />
      </Button>
    </Link>
  );
};

export const CreatePageButton = () => (
  <Link href="/dashboard/posts/create" as="/dashboard/posts/create">
    <Button className="border border-neutral-200 bg-indigo-400 text-white shadow-sm hover:bg-indigo-900 focus-visible:outline-indigo-500 active:bg-indigo-600">
      <PlusIcon className="h-6 w-6" />
    </Button>
  </Link>
);

export const EditPageButton = ({ id }: { id: string }) => (
  <Link href={`/dashboard/posts/${id}/edit`} as={`/dashboard/posts/${id}/edit`}>
    <Button className="border border-neutral-200 bg-indigo-400 text-white shadow-sm hover:bg-indigo-900 focus-visible:outline-indigo-500 active:bg-indigo-600">
      <PencilSquareIcon className="h-6 w-6" />
    </Button>
  </Link>
);

export const DeletePostButton = ({ id }: { id: string }) => {
  const deletePostWithId = async () => {
    try {
      await deletePost(id);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <form action={deletePostWithId}>
      <Button className="border bg-white text-indigo-500 shadow-sm hover:border-neutral-200 hover:bg-indigo-500 hover:text-white focus-visible:outline-indigo-500 active:bg-indigo-600">
        <TrashIcon className="h-6 w-6" />
      </Button>
    </form>
  );
};

export const LogoutButton = () => {
  const { pending } = useFormStatus();

  const router = useRouter();

  const logout = async () => {
    try {
      await signOut({
        redirect: false,
      });

      router.push("/");
      router.refresh();
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <form action={logout}>
      <Button
        className="border border-neutral-200 bg-indigo-400 px-4 py-2 text-white shadow-sm hover:bg-indigo-900 focus-visible:outline-indigo-500 active:bg-indigo-600"
        aria-disabled={pending}
      >
        <PowerIcon className="h-7 w-7" />
      </Button>
    </form>
  );
};
