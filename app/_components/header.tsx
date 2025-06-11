"use client";

import Link from "next/link";
import { cn } from "../lib/utils";
import {
  HomeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ChartBarIcon,
  Squares2X2Icon, // Used for Dashboard in first code, keeping for consistency
  Bars3Icon,
  XMarkIcon,
  InformationCircleIcon,
  BookOpenIcon,
  ChartBarSquareIcon, // Used for Progress
  CalendarIcon, // Used for Book Trainer
  UserCircleIcon, // Used for My Account and possibly Users
  Cog6ToothIcon, // Used for Settings
  CogIcon, // Used for Dashboard in second code
  UserIcon, // Assuming you have a UserIcon from somewhere or will replace it
  // If UserIcon is not from @heroicons/react/24/outline, you need to import it from its correct path.
  // For now, if it causes an error, remove it or replace with UserCircleIcon.
  // We'll replace this with UserCircleIcon if UserIcon is not available
} from "@heroicons/react/24/outline";

// Correct import path for NotificationDropdown
import NotificationDropdown from "../../components/NotificationDropdown";
import UserDropdown from "./user-dropdown";
import CartIcon from "./cart-icon";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get user role directly from session instead of fetching separately
  const userRole = session?.user?.role || "USER";
  const isLoadingRole = status === "loading";

  // Debug logging (remove in production)
  useEffect(() => {
    console.log("Header session state:", {
      status,
      userRole,
      sessionExists: !!session,
    });
  }, [status, userRole, session]);

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

  // No need to fetch user role separately - it's already in the session

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Helper function to render links based on user role and loading state
  const renderLink = (
    href: string,
    icon: React.ElementType,
    label: string,
    roles: string[],
    isMobile: boolean = false,
  ) => {
    // Only render if session exists OR if the link is meant for all (no roles specified)
    if (!session && roles.length > 0) return null;
    // If roles are specified, check if userRole is included, or if no specific role is needed
    if (roles.length > 0 && !roles.includes(userRole) && !isLoadingRole)
      return null;

    const IconComponent = icon;
    const LinkComponent = isMobile ? MobileHeaderLink : HeaderLink;

    return (
      <LinkComponent
        href={href}
        onClick={isMobile ? () => setMobileMenuOpen(false) : undefined}
      >
        <IconComponent className="mr-1 h-5 w-5" />
        {label}
      </LinkComponent>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 h-20 w-full shadow-lg",
        scrolled
          ? "bg-[#2A2A2A]/95 backdrop-blur-sm"
          : "bg-[#2A2A2A]/80 backdrop-blur-sm",
      )}
    >
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <div className="flex items-center">
          <Link
            href="/"
            className="mr-8 text-2xl font-bold whitespace-nowrap text-[#D5FC51]"
          >
            SixStar Fitness
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-1 md:flex">
            {renderLink("/", HomeIcon, "Home", [])} {/* Always visible */}
            {renderLink("/about", InformationCircleIcon, "About", [])}{" "}
            {/* Always visible */}
            {renderLink("/workouts", BookOpenIcon, "Workouts", [])}{" "}
            {/* Always visible */}
            {/* Dashboard: Show for ADMIN, or all authenticated users (depending on your logic) */}
            {/* Using CogIcon for admin dashboard as in second code, otherwise Squares2X2Icon */}
            {session && (userRole === "ADMIN" || userRole === "TRAINER")
              ? renderLink("/admin", CogIcon, "Dashboard", ["ADMIN", "TRAINER"])
              : session
                ? renderLink("/dashboard", Squares2X2Icon, "Dashboard", [
                    "USER",
                  ]) // Regular user dashboard
                : null}
            {session &&
              renderLink("/progress", ChartBarSquareIcon, "Progress", [
                "USER",
                "ADMIN",
                "TRAINER",
              ])}{" "}
            {/* For all authenticated users */}
            {renderLink("/book-trainer", CalendarIcon, "Book Trainer", [])}{" "}
            {/* Always visible */}
            {renderLink("/trainers", UserGroupIcon, "Trainers", [])}{" "}
            {/* Always visible */}
            {/* Users: Show for ADMIN and TRAINER */}
            {isLoadingRole
              ? null
              : (userRole === "ADMIN" || userRole === "TRAINER") &&
                renderLink("/users", UserCircleIcon, "Users", [
                  "ADMIN",
                  "TRAINER",
                ])}
            {/* Reports: Show for ADMIN only */}
            {isLoadingRole
              ? null
              : userRole === "ADMIN" &&
                renderLink("/reports", ChartBarIcon, "Reports", ["ADMIN"])}
            {renderLink("/shop", ShoppingBagIcon, "Shop", [])}{" "}
            {/* Always visible */}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications - only show for authenticated users */}
          {session && <NotificationDropdown />}

          {/* Cart Icon */}
          <CartIcon />

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
          className="absolute top-full left-0 w-full bg-[#2A2A2A]/95 px-4 py-2 shadow-lg backdrop-blur-sm md:hidden"
        >
          <div className="flex flex-col space-y-1">
            {renderLink("/", HomeIcon, "Home", [], true)}
            {renderLink("/about", InformationCircleIcon, "About", [], true)}
            {renderLink("/workouts", BookOpenIcon, "Workouts", [], true)}
            {/* Mobile Dashboard link */}
            {session && (userRole === "ADMIN" || userRole === "TRAINER")
              ? renderLink(
                  "/admin",
                  CogIcon,
                  "Dashboard",
                  ["ADMIN", "TRAINER"],
                  true,
                )
              : session
                ? renderLink(
                    "/dashboard",
                    Squares2X2Icon,
                    "Dashboard",
                    ["USER"],
                    true,
                  )
                : null}
            {session &&
              renderLink(
                "/progress",
                ChartBarSquareIcon,
                "Progress",
                ["USER", "ADMIN", "TRAINER"],
                true,
              )}
            {renderLink(
              "/book-trainer",
              CalendarIcon,
              "Book Trainer",
              [],
              true,
            )}
            {renderLink("/trainers", UserGroupIcon, "Trainers", [], true)}
            {/* Mobile Users link */}
            {isLoadingRole
              ? null
              : (userRole === "ADMIN" || userRole === "TRAINER") &&
                renderLink(
                  "/users",
                  UserCircleIcon,
                  "Users",
                  ["ADMIN", "TRAINER"],
                  true,
                )}
            {/* Mobile Reports link */}
            {isLoadingRole
              ? null
              : userRole === "ADMIN" &&
                renderLink(
                  "/reports",
                  ChartBarIcon,
                  "Reports",
                  ["ADMIN"],
                  true,
                )}
            {renderLink("/shop", ShoppingBagIcon, "Shop", [], true)}
            {renderLink("/shop/cart", ShoppingBagIcon, "Cart", [], true)}{" "}
            {/* Cart has its own mobile link */}
            {renderLink("/account", UserCircleIcon, "My Account", [], true)}
            {renderLink("/settings", Cog6ToothIcon, "Settings", [], true)}
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
        "border-b-2 border-transparent hover:border-[#D5FC51]",
        "rounded-md hover:bg-[#2A2A2A]/50",
        "!transition-none", // Override any global transitions
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
        "border-l-4 border-transparent hover:border-[#D5FC51]",
        "rounded-md hover:bg-[#2A2A2A]/70",
        "!transition-none", // Override any global transitions
      )}
    >
      {children}
    </Link>
  );
}
