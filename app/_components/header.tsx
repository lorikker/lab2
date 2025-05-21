"use client";

import Link from "next/link";
import { cn } from "../lib/utils";
import { HomeIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import UserDropdown from "./user-dropdown";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 w-full bg-[#2A2A2A] py-4 text-white">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="mr-8 text-2xl font-bold text-[#D5FC51]">
            FitnessHub
          </Link>
          <nav className="hidden items-center space-x-6 md:flex">
            <HeaderLink href="/">Home</HeaderLink>
            <HeaderLink href="/services">Services</HeaderLink>
            <HeaderLink href="/about">About</HeaderLink>
            <HeaderLink href="/pricing">Pricing</HeaderLink>
            <HeaderLink href="/contact">Contact</HeaderLink>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="flex items-center rounded-md border border-[#D5FC51] px-4 py-2 text-sm font-medium text-[#D5FC51] transition-colors duration-200 hover:bg-[#D5FC51] hover:text-[#2A2A2A]"
          >
            <ShoppingBagIcon className="mr-2 h-5 w-5" />
            Dashboard
          </Link>
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}

interface HeaderLinkProps {
  href: string;
  children: React.ReactNode;
}

function HeaderLink({ href, children }: HeaderLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 text-sm font-medium",
        "text-white hover:text-[#D5FC51]",
        "transition-colors duration-200",
      )}
    >
      {children}
    </Link>
  );
}
