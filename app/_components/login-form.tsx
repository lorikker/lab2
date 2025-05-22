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
import Link from "next/link";
import PasswordInput from "./password-input";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const registered = searchParams.get("registered");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    registered === "true"
      ? "Registration successful! Please log in with your new account."
      : "",
  );

  const authenticate = async (formData: FormData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    console.log("Attempting login with:", { email });

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("Login response:", response);

      if (response?.error) {
        console.error("Login error:", response.error);
        setError("CredentialsSignin");
      } else {
        console.log("Login successful, redirecting...");
        router.refresh();
        router.push(callbackUrl ?? "/");
      }
    } catch (error: any) {
      console.error("Login exception:", error);
      setError(String(error)); // Ensure error is converted to a string
    }
  };

  return (
    <form action={authenticate} className="w-full space-y-3 px-10">
      <h1 className="mb-3 text-2xl font-bold text-[#2A2A2A]">Welcome Back</h1>
      <p className="mb-6 text-center text-[#2A2A2A]">
        Please log in to continue
      </p>

      <div className="w-full">
        <div>
          <label
            className="mt-5 mb-3 block text-xs font-medium text-[#2A2A2A]"
            htmlFor="email"
          >
            Email
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-[#D9D9D9] py-[9px] pl-10 text-sm text-[#2A2A2A] placeholder:text-gray-500 focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email address"
              required
            />
            <AtSymbolIcon className="pointer-events-none absolute top-1/2 left-3 h-[18px] w-[18px] -translate-y-1/2 text-[#2A2A2A] peer-focus:text-[#D5FC51]" />
          </div>
        </div>
        <div className="mt-4">
          <PasswordInput
            id="password"
            name="password"
            label="Password"
            placeholder="Enter password"
            required
            minLength={6}
            icon={<KeyIcon className="h-[18px] w-[18px]" />}
          />
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
        {successMessage && (
          <p aria-live="polite" className="text-sm text-green-600">
            {successMessage}
          </p>
        )}
      </div>

      <div className="mt-4 mb-8 text-center">
        <p className="text-sm text-[#2A2A2A]">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-[#D5FC51] hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="w-full bg-[#D5FC51] text-[#2A2A2A] hover:opacity-90 focus-visible:outline-[#D5FC51] active:bg-[#D5FC51]/90"
      aria-disabled={pending}
    >
      Log in
      <ArrowRightIcon className="ml-auto h-5 w-5 text-[#2A2A2A]" />
    </Button>
  );
}
