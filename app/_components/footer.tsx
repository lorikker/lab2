"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#2A2A2A] py-12 text-white">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <h3 className="mb-4 text-xl font-bold text-[#D5FC51]">
              SixStarFitness
            </h3>
            <p className="mb-4 text-[#D9D9D9]">
              Transform your body, transform your life with our state-of-the-art
              facilities and expert guidance.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[#D9D9D9] hover:text-[#D5FC51]">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/trainers"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  Trainers
                </Link>
              </li>
              <li>
                <Link
                  href="/membership"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  Membership Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/trainers"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  Personal Training
                </Link>
              </li>
              <li>
                <Link
                  href="/trainers"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  Online Training
                </Link>
              </li>
              <li>
                <Link
                  href="/trainers"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  Diet & Nutrition
                </Link>
              </li>
              <li>
                <Link
                  href="/membership"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  Gym Membership
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  Fitness Products
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/login"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  href="/trainers/apply"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  Become a Trainer
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">Contact Us</h3>
            <address className="not-italic">
              <p className="mb-2 text-[#D9D9D9]">123 Fitness Street</p>
              <p className="mb-2 text-[#D9D9D9]">Workout City, WC 12345</p>
              <p className="mb-2 text-[#D9D9D9]">
                Email: info@SixStarFitness.com
              </p>
              <p className="mb-2 text-[#D9D9D9]">Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center">
          <p className="text-[#D9D9D9]">
            © {new Date().getFullYear()} SixStarFitness. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
