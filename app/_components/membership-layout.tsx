"use client";

import Link from "next/link";
import { CheckIcon, StarIcon, ShieldCheckIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

interface MembershipLayoutProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  benefits: { title: string; description: string }[];
  callToAction: string;
  backgroundImage: string;
}

export default function MembershipLayout({
  title,
  price,
  description,
  features,
  benefits,
  callToAction,
  backgroundImage,
}: MembershipLayoutProps) {
  const pathname = usePathname();

  // Determine icon based on plan title
  const getPlanIcon = () => {
    switch(title.toLowerCase()) {
      case 'basic':
        return <CheckIcon className="h-16 w-16 text-[#D5FC51] mb-4" />;
      case 'premium':
        return <StarIcon className="h-16 w-16 text-[#D5FC51] mb-4" />;
      case 'elite':
        return <SparklesIcon className="h-16 w-16 text-[#D5FC51] mb-4" />;
      default:
        return <ShieldCheckIcon className="h-16 w-16 text-[#D5FC51] mb-4" />;
    }
  };

  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center bg-[#2A2A2A] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
          }}
        ></div>
        <div className="relative z-10 container text-center">
          <div className="flex flex-col items-center justify-center">
            {getPlanIcon()}
            <h1 className="mb-6 text-4xl leading-tight font-bold md:text-5xl">
              <span className="text-[#D5FC51]">{title}</span> Membership
            </h1>
          </div>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-[#D9D9D9]">
            {description}
          </p>
          <div className="mb-8 bg-black bg-opacity-30 py-6 px-8 rounded-lg inline-block">
            <span className="text-5xl font-bold text-[#D5FC51]">${price}</span>
            <span className="text-[#D9D9D9]">/month</span>
            <p className="mt-2 text-sm text-[#D9D9D9]">No contract, cancel anytime</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={`/membership/checkout?plan=${title.toLowerCase()}`} className="btn btn-primary">
              {callToAction}
            </Link>
            <Link href="/membership" className="btn btn-outline">
              Compare Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Plan Navigation */}
      <section className="bg-white py-4 shadow-md">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/membership/basic"
              className={`px-4 py-2 rounded-md font-medium ${
                pathname === "/membership/basic"
                  ? "bg-[#D5FC51] text-[#2A2A2A]"
                  : "text-[#2A2A2A] hover:bg-[#D9D9D9]"
              }`}
            >
              Basic Plan
            </Link>
            <Link
              href="/membership/premium"
              className={`px-4 py-2 rounded-md font-medium ${
                pathname === "/membership/premium"
                  ? "bg-[#D5FC51] text-[#2A2A2A]"
                  : "text-[#2A2A2A] hover:bg-[#D9D9D9]"
              }`}
            >
              Premium Plan
            </Link>
            <Link
              href="/membership/elite"
              className={`px-4 py-2 rounded-md font-medium ${
                pathname === "/membership/elite"
                  ? "bg-[#D5FC51] text-[#2A2A2A]"
                  : "text-[#2A2A2A] hover:bg-[#D9D9D9]"
              }`}
            >
              Elite Plan
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-block text-sm tracking-wider text-[#2A2A2A] uppercase">
              plan features
            </span>
            <h2 className="mb-4 text-3xl font-bold text-[#2A2A2A]">
              What's Included
            </h2>
            <p className="mx-auto max-w-2xl text-[#2A2A2A]">
              Everything you get with the {title} membership plan
            </p>
          </div>
          <div className="mx-auto max-w-3xl">
            <ul className="mb-8 grid gap-4 md:grid-cols-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start rounded-lg border border-[#D9D9D9] bg-white p-4 shadow-sm transition-all duration-300 hover:border-[#D5FC51] hover:shadow-md">
                  <CheckIcon className="mr-3 h-6 w-6 flex-shrink-0 text-[#D5FC51]" />
                  <span className="text-[#2A2A2A]">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 text-center">
              <Link href={`/membership/checkout?plan=${title.toLowerCase()}`} className="btn btn-primary">
                {callToAction}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section bg-[#D9D9D9]">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-block text-sm tracking-wider text-[#2A2A2A] uppercase">
              why choose this plan
            </span>
            <h2 className="mb-4 text-3xl font-bold text-[#2A2A2A]">
              Benefits of {title} Membership
            </h2>
            <p className="mx-auto max-w-2xl text-[#2A2A2A]">
              Discover how our {title} plan can transform your fitness journey
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="rounded-lg border border-[#2A2A2A] bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#D5FC51] hover:shadow-md">
                <div className="mb-4 rounded-full bg-[#D5FC51] p-2 inline-block">
                  <ShieldCheckIcon className="h-6 w-6 text-[#2A2A2A]" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-[#2A2A2A]">
                  {benefit.title}
                </h3>
                <p className="text-[#2A2A2A]">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-block text-sm tracking-wider text-[#2A2A2A] uppercase">
              member stories
            </span>
            <h2 className="mb-4 text-3xl font-bold text-[#2A2A2A]">
              What Our Members Say
            </h2>
            <p className="mx-auto max-w-2xl text-[#2A2A2A]">
              Real experiences from our {title} plan members
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-[#D9D9D9] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center">
                <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-[#D9D9D9]">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
                    alt="Member"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2A2A2A]">Sarah J.</h3>
                  <p className="text-sm text-[#2A2A2A]">Member for 8 months</p>
                </div>
              </div>
              <p className="text-[#2A2A2A]">
                "The {title} plan has completely transformed my fitness routine. The facilities are amazing and the staff is always helpful!"
              </p>
            </div>
            <div className="rounded-lg border border-[#D9D9D9] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center">
                <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-[#D9D9D9]">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
                    alt="Member"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2A2A2A]">Michael T.</h3>
                  <p className="text-sm text-[#2A2A2A]">Member for 1 year</p>
                </div>
              </div>
              <p className="text-[#2A2A2A]">
                "I've tried other gyms before, but the {title} membership at FitnessHub offers the best value for money. Highly recommend!"
              </p>
            </div>
            <div className="rounded-lg border border-[#D9D9D9] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center">
                <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-[#D9D9D9]">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80"
                    alt="Member"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2A2A2A]">Aisha K.</h3>
                  <p className="text-sm text-[#2A2A2A]">Member for 6 months</p>
                </div>
              </div>
              <p className="text-[#2A2A2A]">
                "The {title} plan gives me everything I need for my fitness goals. The trainers are knowledgeable and the community is so supportive!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section bg-[#D5FC51]">
        <div className="container text-center">
          <h2 className="mb-6 text-3xl font-bold text-[#2A2A2A]">
            Ready to start your fitness journey?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-[#2A2A2A]">
            Join our {title} plan today and take the first step towards a healthier, stronger you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/membership/checkout?plan=${title.toLowerCase()}`}
              className="btn bg-[#2A2A2A] text-white hover:opacity-90"
            >
              {callToAction}
            </Link>
            <Link
              href="/membership"
              className="btn border border-[#2A2A2A] text-[#2A2A2A] hover:bg-[#2A2A2A] hover:text-white"
            >
              Compare All Plans
            </Link>
          </div>
          <p className="mt-6 text-sm text-[#2A2A2A]">
            No commitment required. Cancel anytime.
          </p>
        </div>
      </section>
    </main>
  );
}
