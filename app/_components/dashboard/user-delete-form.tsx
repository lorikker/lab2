"use client";

import { useEffect } from "react";
import { deleteUser } from "@/app/lib/actions";
import { useFormState, useFormStatus } from "react-dom";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

type User = {
  id: string;
  name: string | null;
  email: string | null;
};

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50"
      disabled={pending}
    >
      {pending ? "Deleting..." : "Delete User"}
    </button>
  );
}

export default function UserDeleteForm({ user, onClose }: { user: User; onClose: () => void }) {
  const initialState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useFormState(deleteUser, initialState);

  // Close modal on success
  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.success, onClose]);

  return (
    <form action={dispatch} className="space-y-4">
      <input type="hidden" name="userId" value={user.id} />
      
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <XMarkIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <h3 className="mt-3 text-lg font-medium text-gray-900">Delete User</h3>
        <p className="mt-2 text-sm text-gray-500">
          Are you sure you want to delete {user.name || user.email}? This action cannot be undone.
        </p>
      </div>
      
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
        <DeleteButton />
      </div>
      
      {state.message && (
        <div className={`flex items-center text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
          {state.success ? (
            <CheckIcon className="mr-1 h-4 w-4" />
          ) : (
            <XMarkIcon className="mr-1 h-4 w-4" />
          )}
          {state.message}
        </div>
      )}
    </form>
  );
}
