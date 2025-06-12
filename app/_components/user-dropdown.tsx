"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  UserCircleIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { revokeAdminAccess } from "@/app/_components/dashboard-access-guard";

export default function UserDropdown() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    // Revoke admin access before logging out
    revokeAdminAccess();

    await signOut({ redirect: false });

    // Clear cart state by dispatching a custom event
    window.dispatchEvent(new CustomEvent("userLoggedOut"));

    router.push("/");
    router.refresh();
  };

  if (status === "loading") {
    return (
      <div className="h-10 w-10 animate-pulse rounded-full bg-[#D9D9D9]"></div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/login"
          className="flex items-center rounded-md bg-[#D5FC51] px-4 py-2 text-sm font-medium text-[#2A2A2A] transition-colors duration-200 hover:opacity-90"
        >
          <UserCircleIcon className="mr-2 h-5 w-5" />
          Login
        </Link>
        <Link
          href="/register"
          className="flex items-center rounded-md border border-[#D5FC51] px-4 py-2 text-sm font-medium text-[#D5FC51] transition-colors duration-200 hover:bg-[#D5FC51] hover:text-[#2A2A2A]"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-full border border-[#D9D9D9] bg-[#2A2A2A] p-2 text-white transition-colors duration-200 hover:border-[#D5FC51]"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D5FC51]">
          <UserCircleIcon className="h-6 w-6 text-[#2A2A2A]" />
        </div>
        <span className="hidden text-sm font-medium md:block">
          {session?.user?.name || "User"}
        </span>
        <ChevronDownIcon className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border border-[#D9D9D9] bg-white py-2 shadow-lg">
          <div className="border-b border-[#D9D9D9] px-4 py-2">
            <p className="font-medium text-[#2A2A2A]">{session?.user?.name}</p>
            <p className="text-xs text-[#2A2A2A]">{session?.user?.email}</p>
          </div>
          <Link
            href="/account"
            className="flex w-full items-center px-4 py-2 text-sm text-[#2A2A2A] hover:bg-[#D9D9D9]"
            onClick={() => setIsOpen(false)}
          >
            <UserCircleIcon className="mr-2 h-5 w-5" />
            My Account
          </Link>
          <Link
            href="/settings"
            className="flex w-full items-center px-4 py-2 text-sm text-[#2A2A2A] hover:bg-[#D9D9D9]"
            onClick={() => setIsOpen(false)}
          >
            <Cog6ToothIcon className="mr-2 h-5 w-5" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2 text-sm text-[#2A2A2A] hover:bg-[#D9D9D9]"
          >
            <PowerIcon className="mr-2 h-5 w-5" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
