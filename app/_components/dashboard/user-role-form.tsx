"use client";

import { useEffect, useState } from "react";
import { updateUserRole } from "@/app/lib/actions";
import { useFormState, useFormStatus } from "react-dom";
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
      {pending ? "Updating..." : "Update"}
    </button>
  );
}

export default function UserRoleForm({ user }: { user: User }) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(updateUserRole, initialState);
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset success message after 3 seconds
  useEffect(() => {
    if (state.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.success]);

  return (
    <form action={dispatch} className="flex items-center space-x-2">
      <input type="hidden" name="userId" value={user.id} />
      
      <select
        name="role"
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 shadow-sm focus:border-[#D5FC51] focus:outline-none focus:ring-1 focus:ring-[#D5FC51]"
      >
        <option value="USER">User</option>
        <option value="TRAINER">Trainer</option>
        <option value="ADMIN">Admin</option>
      </select>
      
      <SubmitButton />
      
      {showSuccess && (
        <span className="flex items-center text-sm text-green-600">
          <CheckIcon className="mr-1 h-4 w-4" />
          Updated
        </span>
      )}
      
      {state.message && !state.success && (
        <span className="flex items-center text-sm text-red-600">
          <XMarkIcon className="mr-1 h-4 w-4" />
          {state.message}
        </span>
      )}
    </form>
  );
}
