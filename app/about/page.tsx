import type { Metadata } from "next";
import Link from "next/link";
import ErrorSuppressor from "../_components/error-suppressor";

export const metadata: Metadata = {
  title: "About Us - SixStar Fitness",
  description:
    "Learn about SixStar Fitness, our mission, values, and facilities",
};

const CheckIcon = () => (
  <svg
    className="h-6 w-6 flex-shrink-0 text-[#D5FC51]"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M5 13l4 4L19 7" />
  </svg>
);

const ValueIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D5FC51]/20 text-2xl text-[#D5FC51]">
    {children}
  </div>
);

export default function AboutPage() {
  return (
    <>
      <ErrorSuppressor />
      <main className="flex min-h-screen flex-col bg-gray-50 font-sans">
        {/* Hero */}
        <section className="relative flex h-[70vh] items-center justify-center overflow-hidden bg-[#1f1f1f] text-white">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48"
            alt="Gym interior"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
            loading="lazy"
          />
          <div className="relative z-10 max-w-4xl px-6 text-center">
            <h1 className="mb-4 text-5xl leading-tight font-extrabold sm:text-6xl md:text-7xl">
              Welcome to <span className="text-[#D5FC51]">SixStar Fitness</span>
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-lg text-[#EAEAEA]/90 sm:text-xl">
              A state-of-the-art fitness community built on passion, power, and
              progress since 2018.
            </p>
            <Link
              href="#join"
              className="inline-block rounded-full bg-[#D5FC51] px-8 py-3 font-semibold text-black transition hover:bg-[#b3d837]"
            >
              Join the Journey
            </Link>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </section>

        {/* Our Story */}
        <section className="container mx-auto flex flex-col gap-12 px-6 py-20 md:flex-row md:items-center">
          <div className="space-y-6 md:w-1/2">
            <span className="inline-block rounded-full bg-[#D5FC51]/30 px-4 py-1 text-sm font-semibold text-[#2A2A2A]">
              EST. 2018
            </span>
            <h2 className="text-4xl leading-tight font-extrabold text-[#1f1f1f]">
              Our Journey to <span className="text-[#D5FC51]">Excellence</span>
            </h2>
            <p className="leading-relaxed text-gray-700">
              SixStar Fitness began with a vision to create an{" "}
              <strong>inclusive fitness community</strong> where everyone feels
              welcome, regardless of their fitness level or background.
            </p>
            <p className="leading-relaxed text-gray-700">
              What started as a small campus gym has evolved into a
              comprehensive wellness center serving thousands of members with
              state-of-the-art equipment and expert guidance.
            </p>
            <ul className="mt-6 space-y-3 text-gray-600">
              <li className="flex items-center gap-3">
                <CheckIcon />
                <span>5,000+ active members</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckIcon />
                <span>15+ fitness awards</span>
              </li>
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-xl shadow-xl md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f"
              alt="Gym history"
              className="h-[400px] w-full object-cover"
              loading="lazy"
            />
            <div className="pointer-events-none absolute -top-6 -left-6 h-24 w-24 rounded-full bg-[#D5FC51]/30 blur-xl"></div>
            <div className="pointer-events-none absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-[#D5FC51]/20 blur-2xl"></div>
          </div>
        </section>

        {/* Our Achievements */}
        <section className="bg-[#3A4423] py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="mb-10 text-4xl font-bold text-white">
              Our <span className="text-[#D5FC51]">Achievements</span>
            </h2>
            <div className="mx-auto max-w-4xl space-y-6 text-lg font-medium text-white">
              <p>🏆 Awarded “Best Community Gym” 3 years in a row</p>
              <p>🎯 Over 10,000 members transformed and empowered</p>
              <p>💪 Hosted 50+ successful fitness challenges and events</p>
              <p>🌟 Certified trainers with industry-leading expertise</p>
              <p>📈 Growth rate of 25% annually since inception</p>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="bg-[#1f1f1f] py-20 text-white">
          <div className="container mx-auto px-6">
            <h2 className="mb-14 text-center text-4xl font-bold">
              Our <span className="text-[#D5FC51]">Mission</span> & Values
            </h2>
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-5">
              <div className="flex flex-col items-center text-center">
                <ValueIcon>🎯</ValueIcon>
                <h3 className="mb-3 text-xl font-semibold">Our Mission</h3>
                <p className="max-w-xs text-gray-300">
                  To empower individuals through fitness, helping them achieve a
                  healthy lifestyle by offering expert guidance and a supportive
                  community.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <ValueIcon>🤝</ValueIcon>
                <h3 className="mb-3 text-xl font-semibold">Commitment</h3>
                <p className="max-w-xs text-gray-300">
                  We are committed to every client’s personal growth and
                  consistency, delivering motivation and results every step of
                  the way.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <ValueIcon>💪</ValueIcon>
                <h3 className="mb-3 text-xl font-semibold">Strength</h3>
                <p className="max-w-xs text-gray-300">
                  Physical and mental strength is at the core of our philosophy.
                  We build resilience through training and discipline.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <ValueIcon>🌍</ValueIcon>
                <h3 className="mb-3 text-xl font-semibold">Inclusivity</h3>
                <p className="max-w-xs text-gray-300">
                  We welcome all backgrounds and fitness levels. Our environment
                  is built to make everyone feel at home.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <ValueIcon>🚀</ValueIcon>
                <h3 className="mb-3 text-xl font-semibold">Growth</h3>
                <p className="max-w-xs text-gray-300">
                  Progress is our priority. We help you evolve, both physically
                  and mentally, at every stage of your fitness journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Facilities */}
        <section className="container mx-auto px-6 py-20">
          <h2 className="mb-14 text-center text-4xl font-extrabold text-[#1f1f1f]">
            Our Facilities
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f",
                alt: "Weight training area",
                title: "Strength Zone",
                desc: "Comprehensive free weight area with Olympic lifting platforms, squat racks, and a full range of dumbbells and barbells.",
              },
              {
                img: "https://images.unsplash.com/photo-1576678927484-cc907957088c",
                alt: "Cardio equipment",
                title: "Cardio Deck",
                desc: "State-of-the-art cardio machines including treadmills, ellipticals, rowing machines, and stationary bikes with integrated fitness tracking.",
              },
              {
                img: "https://images.unsplash.com/photo-1518611012118-696072aa579a",
                alt: "Group fitness studio",
                title: "Group Studio",
                desc: "Dedicated space for group classes including yoga, pilates, HIIT, and dance, led by expert instructors.",
              },
            ].map(({ img, alt, title, desc }) => (
              <article
                key={title}
                className="rounded-xl bg-white shadow-md transition-shadow duration-300 hover:shadow-2xl"
              >
                <img
                  src={img}
                  alt={alt}
                  className="h-56 w-full rounded-t-xl object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="mb-2 text-2xl font-semibold text-[#1f1f1f]">
                    {title}
                  </h3>
                  <p className="text-gray-600">{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
