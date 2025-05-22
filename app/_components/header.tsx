"use client";

import Link from "next/link";
import { cn } from "../lib/utils";
import {
  HomeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  UserIcon,
  ChartBarIcon,
  Squares2X2Icon,
  Bars3Icon,
  XMarkIcon,
  InformationCircleIcon,
  BookOpenIcon,
  ChartBarSquareIcon,
  CalendarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import UserDropdown from "./user-dropdown";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Add scroll event listener to change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        mobileMenuOpen &&
        !target.closest("#mobile-menu") &&
        !target.closest("#mobile-menu-button")
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  // Determine user role for conditional navigation
  const userRole = session?.user?.role || "USER";

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 w-full transition-all duration-300 ease-in-out",
        scrolled
          ? "bg-[#2A2A2A]/95 py-2 shadow-md backdrop-blur-sm"
          : "bg-[#2A2A2A]/80 py-4 backdrop-blur-sm",
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="mr-8 text-2xl font-bold text-[#D5FC51]">
            SixStar Fitness
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-1 md:flex">
            <HeaderLink href="/">
              <HomeIcon className="mr-1 h-5 w-5" />
              Home
            </HeaderLink>

            {/* About link for all users */}
            <HeaderLink href="/about">
              <InformationCircleIcon className="mr-1 h-5 w-5" />
              About
            </HeaderLink>

            {/* Workouts link for all users */}
            <HeaderLink href="/workouts">
              <BookOpenIcon className="mr-1 h-5 w-5" />
              Workouts
            </HeaderLink>

            {/* Show Dashboard link for all authenticated users */}
            {session && (
              <HeaderLink href="/dashboard">
                <Squares2X2Icon className="mr-1 h-5 w-5" />
                Dashboard
              </HeaderLink>
            )}

            {/* Progress link for authenticated users */}
            {session && (
              <HeaderLink href="/progress">
                <ChartBarSquareIcon className="mr-1 h-5 w-5" />
                Progress
              </HeaderLink>
            )}

            {/* Book Trainer link for all users */}
            <HeaderLink href="/book-trainer">
              <CalendarIcon className="mr-1 h-5 w-5" />
              Book Trainer
            </HeaderLink>

            {/* Show Users link for trainers and admins */}
            {(userRole === "ADMIN" || userRole === "TRAINER") && (
              <HeaderLink href="/users">
                <UserIcon className="mr-1 h-5 w-5" />
                Users
              </HeaderLink>
            )}

            {/* Show Trainers link for all users */}
            <HeaderLink href="/trainers">
              <UserGroupIcon className="mr-1 h-5 w-5" />
              Trainers
            </HeaderLink>

            {/* Show Reports link for admins only */}
            {userRole === "ADMIN" && (
              <HeaderLink href="/reports">
                <ChartBarIcon className="mr-1 h-5 w-5" />
                Reports
              </HeaderLink>
            )}

            {/* Shop link for all users */}
            <HeaderLink href="/shop">
              <ShoppingBagIcon className="mr-1 h-5 w-5" />
              Shop
            </HeaderLink>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <UserDropdown />

          {/* Mobile menu button */}
          <button
            id="mobile-menu-button"
            className="ml-2 rounded-md p-2 text-white hover:bg-[#2A2A2A]/50 md:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="absolute top-full left-0 w-full bg-[#2A2A2A]/95 px-4 py-2 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out md:hidden"
        >
          <div className="flex flex-col space-y-1">
            <MobileHeaderLink href="/" onClick={() => setMobileMenuOpen(false)}>
              <HomeIcon className="mr-2 h-5 w-5" />
              Home
            </MobileHeaderLink>

            {/* About link for all users */}
            <MobileHeaderLink
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
            >
              <InformationCircleIcon className="mr-2 h-5 w-5" />
              About
            </MobileHeaderLink>

            {/* Workouts link for all users */}
            <MobileHeaderLink
              href="/workouts"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookOpenIcon className="mr-2 h-5 w-5" />
              Workouts
            </MobileHeaderLink>

            {/* Show Dashboard link for all authenticated users */}
            {session && (
              <MobileHeaderLink
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Squares2X2Icon className="mr-2 h-5 w-5" />
                Dashboard
              </MobileHeaderLink>
            )}

            {/* Progress link for authenticated users */}
            {session && (
              <MobileHeaderLink
                href="/progress"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ChartBarSquareIcon className="mr-2 h-5 w-5" />
                Progress
              </MobileHeaderLink>
            )}

            {/* Book Trainer link for all users */}
            <MobileHeaderLink
              href="/book-trainer"
              onClick={() => setMobileMenuOpen(false)}
            >
              <CalendarIcon className="mr-2 h-5 w-5" />
              Book Trainer
            </MobileHeaderLink>

            {/* Show Users link for trainers and admins */}
            {(userRole === "ADMIN" || userRole === "TRAINER") && (
              <MobileHeaderLink
                href="/users"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserIcon className="mr-2 h-5 w-5" />
                Users
              </MobileHeaderLink>
            )}

            {/* Show Trainers link for all users */}
            <MobileHeaderLink
              href="/trainers"
              onClick={() => setMobileMenuOpen(false)}
            >
              <UserGroupIcon className="mr-2 h-5 w-5" />
              Trainers
            </MobileHeaderLink>

            {/* Show Reports link for admins only */}
            {userRole === "ADMIN" && (
              <MobileHeaderLink
                href="/reports"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ChartBarIcon className="mr-2 h-5 w-5" />
                Reports
              </MobileHeaderLink>
            )}

            {/* Shop link for all users */}
            <MobileHeaderLink
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingBagIcon className="mr-2 h-5 w-5" />
              Shop
            </MobileHeaderLink>

            {/* My Account link */}
            <MobileHeaderLink
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
            >
              <UserCircleIcon className="mr-2 h-5 w-5" />
              My Account
            </MobileHeaderLink>

            {/* Settings link */}
            <MobileHeaderLink
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Cog6ToothIcon className="mr-2 h-5 w-5" />
              Settings
            </MobileHeaderLink>
          </div>
        </div>
      )}
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
        "flex items-center px-3 py-2 text-sm font-medium",
        "text-white hover:text-[#D5FC51]",
        "transition-all duration-200",
        "border-b-2 border-transparent hover:border-[#D5FC51]",
        "rounded-md hover:bg-[#2A2A2A]/50",
      )}
    >
      {children}
    </Link>
  );
}

interface MobileHeaderLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

function MobileHeaderLink({ href, children, onClick }: MobileHeaderLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center px-4 py-3 text-sm font-medium",
        "text-white hover:text-[#D5FC51]",
        "transition-all duration-200",
        "border-l-4 border-transparent hover:border-[#D5FC51]",
        "rounded-md hover:bg-[#2A2A2A]/70",
      )}
    >
      {children}
    </Link>
  );
}
