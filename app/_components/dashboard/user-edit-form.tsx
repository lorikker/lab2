"use client";

import { useState, useEffect } from "react";
import { updateUserInfo } from "@/app/lib/actions";
import { useActionState, useFormStatus } from "react-dom";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="rounded-md bg-[#D5FC51] px-3 py-1.5 text-sm font-medium text-[#2A2A2A] transition-colors hover:bg-[#D5FC51]/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D5FC51] disabled:opacity-50"
      disabled={pending}
    >
      {pending ? "Saving..." : "Save Changes"}
    </button>
  );
}

export default function UserEditForm({ user, onClose }: { user: User; onClose: () => void }) {
  const initialState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useActionState(updateUserInfo, initialState);
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");

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
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-[#D5FC51] focus:outline-none focus:ring-1 focus:ring-[#D5FC51]"
          required
        />
        {state.errors?.name && (
          <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-[#D5FC51] focus:outline-none focus:ring-1 focus:ring-[#D5FC51]"
          required
        />
        {state.errors?.email && (
          <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
        <SubmitButton />
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
