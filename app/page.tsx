import Link from "next/link";
import Image from "next/image";
import {
  UserGroupIcon,
  ClockIcon,
  HeartIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import BMICalculator from "./_components/bmi-calculator";
import ServiceCard from "./_components/service-card";
import PricingCard from "./_components/pricing-card";
import BounceArrow from "./_components/bounce-arrow";

export default function Home() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="relative -mt-20 flex min-h-screen items-center justify-center bg-[#2A2A2A] pt-20 text-white">
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
          alt="Fitness background"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
          quality={75}
        />
        <div className="container relative z-10 text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
            Ultimate Fitness <span className="text-[#D5FC51]">Experience</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-[#D9D9D9]">
            Transform your body and mind with our state-of-the-art facilities
            and expert trainers. Start your fitness journey today.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link href="/membership" className="btn btn-primary">
              View Membership Plans
            </Link>
            <Link href="/about" className="btn btn-outline">
              Learn More
            </Link>
          </div>
        </div>
        <BounceArrow />
      </section>
      {/* Services Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-block text-sm uppercase tracking-wider text-[#2A2A2A]">
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
        </div>

        <div className="container relative z-10">
          <div className="mb-12 text-center">
            <span className="mb-2 inline-block text-sm uppercase tracking-wider text-[#D5FC51]">
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
                <div className="absolute bottom-0 left-0 right-0 bg-[#2A2A2A]/80 p-4 backdrop-blur-sm">
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

                <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
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
            <span className="mb-2 inline-block text-sm uppercase tracking-wider text-[#2A2A2A]">
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
            <span className="mb-2 inline-block text-sm uppercase tracking-wider text-[#2A2A2A]">
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
