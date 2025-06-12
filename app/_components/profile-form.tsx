"use client";

import { useEffect, useState } from "react";
import { updateUserProfile } from "@/app/lib/actions";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "./button";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  role?: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="bg-[#D5FC51] text-[#2A2A2A] hover:opacity-90"
      disabled={pending}
    >
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

export default function ProfileForm({ user }: { user: User }) {
  const initialState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useFormState(updateUserProfile, initialState);

  // Use state with useEffect to avoid hydration mismatch
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Set initial values after component mounts to avoid hydration mismatch
  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  return (
    <form action={dispatch} className="mb-8">
      <div className="mb-6 space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-[#2A2A2A]"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-[#D9D9D9] p-2 focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
          />
          {state.errors?.name && (
            <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-[#2A2A2A]"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-[#D9D9D9] p-2 focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
          />
          {state.errors?.email && (
            <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          {state.message && (
            <div
              className={`flex items-center text-sm ${state.success ? "text-green-600" : "text-red-600"}`}
            >
              {state.success ? (
                <CheckIcon className="mr-1 h-4 w-4" />
              ) : (
                <XMarkIcon className="mr-1 h-4 w-4" />
              )}
              {state.message}
            </div>
          )}
        </div>
        <SubmitButton />
      </div>
    </form>
  );
}
