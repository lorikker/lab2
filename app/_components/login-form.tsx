"use client";

import { useFormStatus } from "react-dom";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "./button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [error, setError] = useState("");

  const authenticate = async (formData: FormData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (response?.error) {
        setError("CredentialsSignin");
      } else {
        router.refresh();
        router.push(callbackUrl ?? "/");
      }
    } catch (error: any) {
      setError(String(error)); // Ensure error is converted to a string
    }
  };

  return (
    <form action={authenticate} className="w-full space-y-3 px-10">
      <h1 className="mb-3 text-2xl text-indigo-900">
        Please log in to continue.
      </h1>

      <div className="w-full">
        <div>
          <label
            className="mt-5 mb-3 block text-xs font-medium text-indigo-900"
            htmlFor="email"
          >
            Email
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-indigo-200 py-[9px] pl-10 text-sm text-black placeholder:text-gray-500"
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email address"
              required
            />
            <AtSymbolIcon className="pointer-events-none absolute top-1/2 left-3 h-[18px] w-[18px] -translate-y-1/2 text-indigo-500 peer-focus:text-indigo-700" />
          </div>
        </div>
        <div className="mt-4">
          <label
            className="mt-5 mb-3 block text-xs font-medium text-indigo-900"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-indigo-200 py-[9px] pl-10 text-sm text-black placeholder:text-gray-500"
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              required
              minLength={6}
            />
            <KeyIcon className="pointer-events-none absolute top-1/2 left-3 h-[18px] w-[18px] -translate-y-1/2 text-indigo-500 peer-focus:text-indigo-700" />
          </div>
        </div>
      </div>
      <LoginButton />
      <div className="flex h-8 items-start space-x-1">
        {error === "CredentialsSignin" && (
          <>
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p aria-live="polite" className="text-sm text-red-500">
              Invalid credentials
            </p>
          </>
        )}
      </div>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="w-full bg-indigo-400 text-white hover:bg-indigo-500 focus-visible:outline-indigo-500 active:bg-indigo-600"
      aria-disabled={pending}
    >
      Log in
      <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
