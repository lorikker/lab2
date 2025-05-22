"use client";

import Link from "next/link";
import { useState } from "react";
import {
  UserGroupIcon,
  ClockIcon,
  HeartIcon,
  SparklesIcon,
  ArrowPathIcon,
  ScaleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import ClientSVG from "./_components/client-svg";

// BMI Calculator Component
function BMICalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState("");

  const calculateBMI = () => {
    if (!height || !weight) return;

    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);

    if (heightInMeters <= 0 || weightInKg <= 0) return;

    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    setBmi(parseFloat(bmiValue.toFixed(1)));

    // Determine BMI category
    if (bmiValue < 18.5) {
      setBmiCategory("Underweight");
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      setBmiCategory("Normal weight");
    } else if (bmiValue >= 25 && bmiValue < 30) {
      setBmiCategory("Overweight");
    } else {
      setBmiCategory("Obesity");
    }
  };

  const resetCalculator = () => {
    setHeight("");
    setWeight("");
    setBmi(null);
    setBmiCategory("");
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-6">
        <div className="flex space-x-4">
          <button
            className={`flex-1 rounded-md px-4 py-2 font-medium transition-colors ${
              gender === "male"
                ? "bg-[#2A2A2A] text-white"
                : "bg-[#D9D9D9] text-[#2A2A2A] hover:bg-[#D9D9D9]/80"
            }`}
            onClick={() => setGender("male")}
          >
            <UserIcon className="mr-2 inline-block h-5 w-5" /> Male
          </button>
          <button
            className={`flex-1 rounded-md px-4 py-2 font-medium transition-colors ${
              gender === "female"
                ? "bg-[#2A2A2A] text-white"
                : "bg-[#D9D9D9] text-[#2A2A2A] hover:bg-[#D9D9D9]/80"
            }`}
            onClick={() => setGender("female")}
          >
            <UserIcon className="mr-2 inline-block h-5 w-5" /> Female
          </button>
        </div>

        <div>
          <label
            htmlFor="height"
            className="mb-2 block text-sm font-medium text-[#2A2A2A]"
          >
            Height (cm)
          </label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full rounded-md border border-[#D9D9D9] p-2 focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
            placeholder="Enter your height in cm"
          />
        </div>

        <div>
          <label
            htmlFor="weight"
            className="mb-2 block text-sm font-medium text-[#2A2A2A]"
          >
            Weight (kg)
          </label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full rounded-md border border-[#D9D9D9] p-2 focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none"
            placeholder="Enter your weight in kg"
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={calculateBMI}
            className="flex-1 rounded-md bg-[#D5FC51] px-4 py-2 font-medium text-[#2A2A2A] transition-colors hover:opacity-90"
          >
            <ScaleIcon className="mr-2 inline-block h-5 w-5" /> Calculate BMI
          </button>
          <button
            onClick={resetCalculator}
            className="rounded-md border border-[#D9D9D9] bg-white px-4 py-2 font-medium text-[#2A2A2A] transition-colors hover:bg-[#D9D9D9]/20"
          >
            <ArrowPathIcon className="mr-2 inline-block h-5 w-5" /> Reset
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-md">
        {bmi === null ? (
          <div className="text-center">
            <ScaleIcon className="mx-auto mb-4 h-16 w-16 text-[#D9D9D9]" />
            <h3 className="text-xl font-bold text-[#2A2A2A]">
              Your BMI Result
            </h3>
            <p className="mt-2 text-[#2A2A2A]">
              Fill in your details and click "Calculate BMI" to see your
              results.
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-[#D5FC51]">
              <span className="text-4xl font-bold text-[#2A2A2A]">{bmi}</span>
            </div>
            <h3 className="text-xl font-bold text-[#2A2A2A]">{bmiCategory}</h3>
            <p className="mt-4 text-[#2A2A2A]">
              {bmiCategory === "Underweight"
                ? "You may need to gain some weight. Consult with our nutritionists."
                : bmiCategory === "Normal weight"
                  ? "Your BMI is within the healthy range. Keep it up!"
                  : bmiCategory === "Overweight"
                    ? "You may benefit from losing some weight. Check our fitness programs."
                    : "It's recommended to reduce your BMI. Our trainers can help you."}
            </p>
            <div className="mt-6 h-4 w-full rounded-full bg-[#D9D9D9]">
              <div
                className={`h-4 rounded-full ${
                  bmiCategory === "Underweight"
                    ? "w-1/4 bg-blue-500"
                    : bmiCategory === "Normal weight"
                      ? "w-2/4 bg-green-500"
                      : bmiCategory === "Overweight"
                        ? "w-3/4 bg-yellow-500"
                        : "w-full bg-red-500"
                }`}
              ></div>
            </div>
            <div className="mt-2 flex w-full justify-between text-xs text-[#2A2A2A]">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
          <ClientSVG>
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
          </ClientSVG>
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
              color="from-blue-400 to-indigo-500"
            />
            <ServiceCard
              icon={<ClockIcon className="h-8 w-8" />}
              title="Flexible Hours"
              description="Open 24/7 to accommodate your busy schedule and fitness needs."
              color="from-green-400 to-emerald-500"
            />
            <ServiceCard
              icon={<HeartIcon className="h-8 w-8" />}
              title="Nutrition Plans"
              description="Custom nutrition guidance to complement your fitness journey."
              color="from-red-400 to-rose-500"
            />
            <ServiceCard
              icon={<SparklesIcon className="h-8 w-8" />}
              title="Modern Equipment"
              description="State-of-the-art equipment for effective and safe workouts."
              color="from-amber-400 to-orange-500"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section relative overflow-hidden bg-[#2A2A2A] text-white">
        <div className="absolute inset-0 opacity-20">
          <ClientSVG>
            <svg
              className="h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="about-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#D5FC51" />
                  <stop offset="100%" stopColor="#2A2A2A" />
                </linearGradient>
              </defs>
              <path
                d="M0,0 L100,0 L100,100 L0,100 Z"
                fill="url(#about-gradient)"
              />
            </svg>
          </ClientSVG>
        </div>

        <div className="relative z-10 container">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-block text-sm tracking-wider text-[#D5FC51] uppercase">
              about us
            </span>
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              Transforming Lives Through{" "}
              <span className="text-[#D5FC51]">Fitness</span>
            </h2>
          </div>

          <div className="grid gap-12 md:grid-cols-12">
            {/* Left column - Image with overlay */}
            <div className="relative md:col-span-5 lg:col-span-4">
              <div className="relative h-full min-h-[300px] overflow-hidden rounded-lg">
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-110"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A2A2A] to-transparent opacity-60"></div>

                {/* Working hours card positioned at the bottom of the image */}
                <div className="absolute right-0 bottom-0 left-0 bg-[#2A2A2A]/80 p-4 backdrop-blur-sm">
                  <h4 className="mb-3 text-lg font-semibold text-[#D5FC51]">
                    Working Hours
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex justify-between border-b border-[#D9D9D9]/20 pb-1">
                      <span className="font-medium text-white">
                        Monday - Friday:
                      </span>
                      <span className="text-[#D9D9D9]">07:00 - 00:00</span>
                    </div>
                    <div className="flex justify-between border-b border-[#D9D9D9]/20 pb-1">
                      <span className="font-medium text-white">Saturday:</span>
                      <span className="text-[#D9D9D9]">07:00 - 00:00</span>
                    </div>
                    <div className="flex justify-between border-b border-[#D9D9D9]/20 pb-1">
                      <span className="font-medium text-white">Sunday:</span>
                      <span className="text-[#D9D9D9]">07:00 - 00:00</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="font-medium text-white">Holidays:</span>
                      <span className="text-[#D9D9D9]">08:00 - 22:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Content */}
            <div className="md:col-span-7 lg:col-span-8">
              <div className="space-y-6">
                <p className="text-lg text-[#D9D9D9]">
                  At{" "}
                  <span className="font-bold text-[#D5FC51]">
                    SixStarFitness
                  </span>
                  , we believe in the transformative power of fitness. Our
                  mission is to provide a welcoming environment where people of
                  all fitness levels can achieve their goals and improve their
                  quality of life.
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg bg-[#FFFFFF]/10 p-5 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1">
                    <h3 className="mb-3 text-xl font-bold text-[#D5FC51]">
                      Our Philosophy
                    </h3>
                    <p className="text-[#D9D9D9]">
                      We believe that fitness is not just about physical
                      strength, but also mental wellbeing. Our holistic approach
                      focuses on creating a balanced lifestyle that enhances all
                      aspects of your life.
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#FFFFFF]/10 p-5 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1">
                    <h3 className="mb-3 text-xl font-bold text-[#D5FC51]">
                      Our Community
                    </h3>
                    <p className="text-[#D9D9D9]">
                      Join a supportive community of like-minded individuals who
                      share your passion for fitness. Our members and staff
                      create an encouraging environment where everyone feels
                      welcome.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <Link
                    href="/about"
                    className="btn bg-[#D5FC51] text-[#2A2A2A] hover:opacity-90"
                  >
                    Learn More About Us
                  </Link>
                  <Link
                    href="/contact"
                    className="btn border border-[#D5FC51] text-[#D5FC51] hover:bg-[#D5FC51] hover:text-[#2A2A2A]"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
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

      {/* BMI Calculator Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-block text-sm tracking-wider text-[#2A2A2A] uppercase">
              health calculator
            </span>
            <h2 className="mb-4 text-3xl font-bold text-[#2A2A2A] md:text-4xl">
              Calculate Your BMI
            </h2>
            <p className="mx-auto max-w-2xl text-[#2A2A2A]">
              Body Mass Index (BMI) is a measure of body fat based on height and
              weight. Use our calculator to find out your BMI and what it means
              for your health.
            </p>
          </div>

          <div className="mx-auto max-w-4xl rounded-lg border border-[#D9D9D9] bg-[#F9F9F9] p-8 shadow-lg">
            <BMICalculator />
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
            Join SixStarFitness today and take the first step towards a
            healthier, stronger you.
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
  color = "from-[#D5FC51] to-[#D5FC51]",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-[#D9D9D9] bg-white p-6 shadow-lg transition-all duration-300 hover:border-[#D5FC51] hover:shadow-xl">
      <div
        className={`absolute -top-12 -right-12 h-24 w-24 rounded-full bg-gradient-to-br ${color} opacity-10 blur-xl transition-all duration-500 group-hover:opacity-20`}
      ></div>
      <div
        className={`mb-4 rounded-full bg-gradient-to-br ${color} p-3 text-white`}
      >
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold text-[#2A2A2A]">{title}</h3>
      <p className="text-[#2A2A2A]">{description}</p>
      <div className="mt-4 h-1 w-0 bg-gradient-to-r from-[#D5FC51] to-[#D5FC51]/70 transition-all duration-300 group-hover:w-full"></div>
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
            <ClientSVG>
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
            </ClientSVG>
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
