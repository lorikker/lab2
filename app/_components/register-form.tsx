"use client";

import { useFormStatus } from "react-dom";
import {
  AtSymbolIcon,
  KeyIcon,
  UserIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "./button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PasswordInput from "./password-input";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  const register = async (formData: FormData) => {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Basic validation
    if (password !== confirmPassword) {
      setError("PasswordMismatch");
      return;
    }

    try {
      // This is a placeholder for actual registration logic
      // In a real app, you would call your API to register the user
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "RegistrationFailed");
      } else {
        // Registration successful
        const result = await response.json();
        console.log("Registration successful:", result);

        // Show success message and redirect to login page
        setError("");
        router.push("/login?registered=true");
      }
    } catch (error: any) {
      setError(String(error));
    }
  };

  return (
    <form action={register} className="w-full space-y-3 px-10">
      <h1 className="mb-3 text-2xl font-bold text-[#2A2A2A]">Create Account</h1>
      <p className="mb-6 text-center text-[#2A2A2A]">
        Join our fitness community today
      </p>

      <div className="w-full">
        <div>
          <label
            className="mt-5 mb-3 block text-xs font-medium text-[#2A2A2A]"
            htmlFor="name"
          >
            Full Name
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-[#D9D9D9] py-[9px] pl-10 text-sm text-[#2A2A2A] placeholder:text-gray-500 focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
              id="name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              required
            />
            <UserIcon className="pointer-events-none absolute top-1/2 left-3 h-[18px] w-[18px] -translate-y-1/2 text-[#2A2A2A] peer-focus:text-[#D5FC51]" />
          </div>
        </div>

        <div className="mt-4">
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
            placeholder="Create a password"
            required
            minLength={6}
            icon={<KeyIcon className="h-[18px] w-[18px]" />}
          />
        </div>

        <div className="mt-4">
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            minLength={6}
            icon={<KeyIcon className="h-[18px] w-[18px]" />}
          />
        </div>
      </div>

      <RegisterButton />

      <div className="flex h-8 items-start space-x-1">
        {error === "PasswordMismatch" && (
          <>
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p aria-live="polite" className="text-sm text-red-500">
              Passwords do not match
            </p>
          </>
        )}
        {error === "Email already registered" && (
          <>
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p aria-live="polite" className="text-sm text-red-500">
              This email is already registered. Please log in instead.
            </p>
          </>
        )}
        {error === "Missing required fields" && (
          <>
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p aria-live="polite" className="text-sm text-red-500">
              Please fill in all required fields.
            </p>
          </>
        )}
        {error &&
          error !== "PasswordMismatch" &&
          error !== "Email already registered" &&
          error !== "Missing required fields" && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p aria-live="polite" className="text-sm text-red-500">
                Registration failed. Please try again.
              </p>
            </>
          )}
      </div>

      <div className="mt-4 mb-8 text-center">
        <p className="text-sm text-[#2A2A2A]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#D5FC51] hover:underline"
          >
            Log in here
          </Link>
        </p>
      </div>
    </form>
  );
}

function RegisterButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="w-full bg-[#D5FC51] text-[#2A2A2A] hover:opacity-90 focus-visible:outline-[#D5FC51] active:bg-[#D5FC51]/90"
      aria-disabled={pending}
    >
      Register
      <ArrowRightIcon className="ml-auto h-5 w-5 text-[#2A2A2A]" />
    </Button>
  );
}
