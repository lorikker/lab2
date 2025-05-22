import Link from "next/link";
import {
  UserGroupIcon,
  ClockIcon,
  HeartIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
export default function Home() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center bg-[#2A2A2A] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
          }}
        ></div>
        <div className="relative z-10 container text-center">
          <h1 className="mb-6 text-5xl leading-tight font-bold md:text-6xl lg:text-7xl">
            Ultimate Fitness <span className="text-[#D5FC51]">Experience</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-[#D9D9D9]">
            Transform your body and mind with our state-of-the-art facilities
            and expert trainers. Start your fitness journey today.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Link href="/membership" className="btn btn-primary">
              View Membership Plans
            </Link>
            <Link href="/about" className="btn btn-outline">
              Learn More
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="h-10 w-10 text-[#D5FC51]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            ></path>
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-block text-sm tracking-wider text-[#2A2A2A] uppercase">
              what we offer
            </span>
            <h2 className="text-3xl font-bold text-[#2A2A2A] md:text-4xl">
              Achieve amazing results with our services
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <ServiceCard
              icon={<UserGroupIcon className="h-8 w-8" />}
              title="Expert Trainers"
              description="Our certified trainers will guide you through personalized workout plans."
            />
            <ServiceCard
              icon={<ClockIcon className="h-8 w-8" />}
              title="Flexible Hours"
              description="Open 24/7 to accommodate your busy schedule and fitness needs."
            />
            <ServiceCard
              icon={<HeartIcon className="h-8 w-8" />}
              title="Nutrition Plans"
              description="Custom nutrition guidance to complement your fitness journey."
            />
            <ServiceCard
              icon={<SparklesIcon className="h-8 w-8" />}
              title="Modern Equipment"
              description="State-of-the-art equipment for effective and safe workouts."
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section bg-[#D9D9D9]">
        <div className="container">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <span className="mb-2 inline-block text-sm tracking-wider text-[#2A2A2A] uppercase">
                about us
              </span>
              <h2 className="mb-6 text-3xl font-bold text-[#2A2A2A] md:text-4xl">
                Sport has the power to change the world
              </h2>
              <p className="mb-6 text-[#2A2A2A]">
                At FitnessHub, we believe in the transformative power of
                fitness. Our mission is to provide a welcoming environment where
                people of all fitness levels can achieve their goals and improve
                their quality of life.
              </p>
              <p className="mb-8 text-[#2A2A2A]">
                With top-notch equipment, expert trainers, and a supportive
                community, we're committed to helping you become the best
                version of yourself.
              </p>
              <Link href="/about" className="btn btn-primary">
                Learn More About Us
              </Link>
            </div>
            <div className="relative h-[400px] overflow-hidden rounded-lg">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-block text-sm tracking-wider text-[#2A2A2A] uppercase">
              membership plans
            </span>
            <h2 className="mb-4 text-3xl font-bold text-[#2A2A2A] md:text-4xl">
              Pricing plans
            </h2>
            <p className="mx-auto max-w-2xl text-[#2A2A2A]">
              Choose the perfect membership plan that fits your fitness goals
              and budget. All plans include access to our state-of-the-art
              facilities and expert guidance.
            </p>
          </div>
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
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section bg-[#D5FC51]">
        <div className="container text-center">
          <h2 className="mb-6 text-3xl font-bold text-[#2A2A2A] md:text-4xl">
            Ready to start your fitness journey?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-[#2A2A2A]">
            Join FitnessHub today and take the first step towards a healthier,
            stronger you.
          </p>
          <Link
            href="/dashboard"
            className="btn bg-[#2A2A2A] text-white hover:opacity-90"
          >
            Go to Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}

// Component for Service Cards
function ServiceCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-[#D9D9D9] bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#D5FC51] hover:shadow-md">
      <div className="mb-4 text-[#D5FC51]">{icon}</div>
      <h3 className="mb-2 text-xl font-bold text-[#2A2A2A]">{title}</h3>
      <p className="text-[#2A2A2A]">{description}</p>
    </div>
  );
}

// Component for Pricing Cards
function PricingCard({
  title,
  price,
  features,
  isPopular,
}: {
  title: string;
  price: string;
  features: string[];
  isPopular: boolean;
}) {
  return (
    <div
      className={`relative rounded-lg border ${isPopular ? "border-[#D5FC51]" : "border-[#D9D9D9]"} bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md ${isPopular ? "scale-105 transform" : ""}`}
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
            <svg
              className="mr-2 h-5 w-5 text-[#D5FC51]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <div className="flex flex-col space-y-2">
        <Link
          href={`/membership/${title.toLowerCase()}`}
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
