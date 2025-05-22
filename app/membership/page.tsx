import Link from "next/link";
import { CheckIcon } from "@heroicons/react/24/outline";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership Plans - FitnessHub",
  description: "Choose the perfect membership plan for your fitness journey",
};

export default function MembershipPage() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] items-center justify-center bg-[#2A2A2A] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
          }}
        ></div>
        <div className="relative z-10 container text-center">
          <h1 className="mb-6 text-4xl leading-tight font-bold md:text-5xl">
            Choose Your <span className="text-[#D5FC51]">Membership</span> Plan
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-[#D9D9D9]">
            Find the perfect plan that fits your fitness goals and budget. All plans include access to our state-of-the-art facilities.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            <PricingCard
              title="Basic"
              price="29.99"
              features={[
                "Access to gym floor",
                "Basic equipment usage",
                "Locker room access",
                "Free water station",
              ]}
              isPopular={false}
              href="/membership/basic"
            />
            <PricingCard
              title="Premium"
              price="49.99"
              features={[
                "All Basic features",
                "Group fitness classes",
                "Personalized workout plan",
                "Nutrition consultation",
              ]}
              isPopular={true}
              href="/membership/premium"
            />
            <PricingCard
              title="Elite"
              price="79.99"
              features={[
                "All Premium features",
                "Personal training sessions",
                "Advanced health monitoring",
                "Exclusive member events",
              ]}
              isPopular={false}
              href="/membership/elite"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-[#D9D9D9]">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#2A2A2A]">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto max-w-2xl text-[#2A2A2A]">
              Find answers to common questions about our membership plans.
            </p>
          </div>
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 rounded-lg border border-[#2A2A2A] bg-white p-6">
              <h3 className="mb-2 text-xl font-bold text-[#2A2A2A]">
                Can I switch between membership plans?
              </h3>
              <p className="text-[#2A2A2A]">
                Yes, you can upgrade or downgrade your membership plan at any time. Changes will take effect at the start of your next billing cycle.
              </p>
            </div>
            <div className="mb-6 rounded-lg border border-[#2A2A2A] bg-white p-6">
              <h3 className="mb-2 text-xl font-bold text-[#2A2A2A]">
                Is there a joining fee?
              </h3>
              <p className="text-[#2A2A2A]">
                No, we don't charge any joining fees. You only pay the monthly membership fee for your chosen plan.
              </p>
            </div>
            <div className="mb-6 rounded-lg border border-[#2A2A2A] bg-white p-6">
              <h3 className="mb-2 text-xl font-bold text-[#2A2A2A]">
                Can I freeze my membership?
              </h3>
              <p className="text-[#2A2A2A]">
                Yes, you can freeze your membership for up to 3 months per year. A small monthly fee applies during the freeze period.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Component for Pricing Cards
function PricingCard({
  title,
  price,
  features,
  isPopular,
  href,
}: {
  title: string;
  price: string;
  features: string[];
  isPopular: boolean;
  href: string;
}) {
  return (
    <div
      className={`relative rounded-lg border ${
        isPopular ? "border-[#D5FC51]" : "border-[#D9D9D9]"
      } bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md ${
        isPopular ? "scale-105 transform" : ""
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#D5FC51] px-4 py-1 text-sm font-bold text-[#2A2A2A]">
          Most Popular
        </div>
      )}
      <h3 className="mb-2 text-2xl font-bold text-[#2A2A2A]">{title}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-[#2A2A2A]">${price}</span>
        <span className="text-[#2A2A2A]">/month</span>
      </div>
      <ul className="mb-6 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-[#2A2A2A]">
            <CheckIcon className="mr-2 h-5 w-5 text-[#D5FC51]" />
            {feature}
          </li>
        ))}
      </ul>
      <div className="flex flex-col space-y-2">
        <Link
          href={href}
          className={`block w-full rounded-md py-2 text-center font-medium ${
            isPopular
              ? "bg-[#D5FC51] text-[#2A2A2A]"
              : "border border-[#D5FC51] text-[#2A2A2A] hover:bg-[#D5FC51]"
          }`}
        >
          View Plan Details
        </Link>
        <Link
          href={`/membership/checkout?plan=${title.toLowerCase()}`}
          className={`block w-full rounded-md py-2 text-center font-medium ${
            isPopular
              ? "border border-[#2A2A2A] text-[#2A2A2A] hover:bg-[#2A2A2A] hover:text-white"
              : "bg-[#2A2A2A] text-white hover:opacity-90"
          }`}
        >
          Join Now
        </Link>
      </div>
    </div>
  );
}
