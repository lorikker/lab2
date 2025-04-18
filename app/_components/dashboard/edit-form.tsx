"use client";

import Link from "next/link";
import { Button } from "../button";
import { useFormStatus } from "react-dom";
import { updatePost } from "@/app/lib/actions";
import type { Post } from "@/app/lib/definitions";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useActionState } from "react";

export default function EditPostForm({ post }: { post: Post }) {
  const initialState = { message: "", errors: {} };
  const updatePostWithId = updatePost.bind(null, post.id);
  const [state, dispatch] = useActionState(updatePostWithId, initialState);

  return (
    <div className="flex flex-col items-center justify-center gap-8 rounded-lg border border-neutral-200 bg-white px-4 py-10 shadow-sm lg:w-[600px]">
      <form
        action={dispatch}
        className="flex w-full flex-col items-start justify-center gap-2 px-4"
      >
        <div className="flex w-full flex-col items-start justify-center gap-1">
          <label
            className="block text-xs font-medium text-indigo-900"
            htmlFor="title"
          >
            Title
          </label>
          <input
            className="peer block w-full rounded-md border border-indigo-200 p-4 text-sm text-indigo-900 placeholder:text-gray-500"
            defaultValue={post.title}
            id="title"
            name="title"
            placeholder="Title"
            aria-describedby="title-error"
          />

          <div
            id="title-error"
            aria-live="polite"
            className="h-8 text-sm text-red-500"
          >
            {state.errors?.title && (
              <>
                {state.errors.title.map((error: string) => (
                  <p key={error}>{error}</p>
                ))}
              </>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col items-start justify-center gap-1">
          <label
            className="block text-xs font-medium text-indigo-900"
            htmlFor="content"
          >
            Content
          </label>
          <textarea
            className="peer block h-40 w-full resize-y rounded-md border border-indigo-200 p-4 text-sm text-indigo-900 placeholder:text-gray-500"
            defaultValue={post.content}
            id="content"
            name="content"
            placeholder="Content"
            aria-describedby="content-error"
          />

          <div
            id="content-error"
            aria-live="polite"
            className="h-8 text-sm text-red-500"
          >
            {state.errors?.content && (
              <>
                {state.errors.content.map((error: string) => (
                  <p key={error}>{error}</p>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-2">
          <div
            aria-live="polite"
            className="flex h-8 items-center gap-1 text-sm text-red-500"
          >
            {state.message && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p>{state.message}</p>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <EditPostButton />

            <Link
              href="/dashboard/posts"
              className="h-10 rounded-lg border bg-white px-4 py-2 text-indigo-500 shadow-sm hover:border-neutral-200 hover:bg-indigo-500 hover:text-white focus-visible:outline-indigo-500 active:bg-indigo-600"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

const EditPostButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      aria-disabled={pending}
      className="border border-neutral-200 bg-indigo-400 px-4 py-2 text-white shadow-sm hover:bg-indigo-900 focus-visible:outline-indigo-500 active:bg-indigo-600"
    >
      Edit Post
    </Button>
  );
};
