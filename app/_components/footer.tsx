"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#2A2A2A] py-12 text-white">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xl font-bold text-[#D5FC51]">
              FitnessHub
            </h3>
            <p className="mb-4 text-[#D9D9D9]">
              Transform your body, transform your life with our
              state-of-the-art facilities and expert guidance.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  Personal Training
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  Group Classes
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  Nutrition Planning
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  Fitness Assessment
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-[#D9D9D9] hover:text-[#D5FC51]"
                >
                  Online Coaching
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
                Email: info@fitnesshub.com
              </p>
              <p className="mb-2 text-[#D9D9D9]">Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center">
          <p className="text-[#D9D9D9]">
            © {new Date().getFullYear()} FitnessHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
