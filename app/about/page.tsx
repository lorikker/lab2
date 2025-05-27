import Image from 'next/image';
import Link from 'next/link';
import { 
  UserGroupIcon, 
  TrophyIcon, 
  HeartIcon, 
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export const metadata = {
  title: 'About Us | SixStar Fitness',
  description: 'Learn about SixStar Fitness, our mission, values, and the team behind our success.',
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="relative overflow-hidden bg-[#2A2A2A]">
        <div className="absolute inset-0">
          <Image
            src="/images/about-hero.jpg"
            alt="Fitness gym interior"
            fill
            className="object-cover object-center opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2A2A2A]/80 to-[#2A2A2A]/95" />
        </div>
        <div className="relative pt-32 pb-16 sm:pb-24 sm:pt-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                About <span className="text-[#D5FC51]">SixStar Fitness</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Transforming lives through fitness excellence since 2015. 
                We're more than just a gym - we're a community dedicated to helping you achieve your fitness goals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-[#2A2A2A] sm:text-4xl">Our Story</h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  SixStar Fitness was founded in 2015 by a group of passionate fitness enthusiasts who believed that fitness should be accessible, enjoyable, and effective for everyone.
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  What started as a small studio with just a handful of members has grown into a thriving community of fitness lovers across multiple locations. Our journey has been one of continuous growth, learning, and adaptation to meet the evolving needs of our members.
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Today, we're proud to offer state-of-the-art facilities, expert trainers, and a supportive community that helps thousands of members achieve their fitness goals every day.
                </p>
              </div>
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src="/images/about-story.jpg"
                  alt="Our gym's journey"
                  width={600}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="bg-[#F8F9FA] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#2A2A2A] sm:text-4xl">Our Values</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              At SixStar Fitness, our values guide everything we do. They're the foundation of our approach to fitness and community.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-[#2A2A2A]">
                  <HeartIcon className="h-8 w-8 flex-none text-[#D5FC51]" aria-hidden="true" />
                  Passion
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    We're passionate about fitness and helping others discover the joy of a healthy, active lifestyle.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-[#2A2A2A]">
                  <UserGroupIcon className="h-8 w-8 flex-none text-[#D5FC51]" aria-hidden="true" />
                  Community
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    We believe in the power of community to motivate, inspire, and support each member on their fitness journey.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-[#2A2A2A]">
                  <TrophyIcon className="h-8 w-8 flex-none text-[#D5FC51]" aria-hidden="true" />
                  Excellence
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    We strive for excellence in everything we do, from our facilities and equipment to our training programs and customer service.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#2A2A2A] sm:text-4xl">Why Choose SixStar Fitness</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We offer more than just a place to work out. Here's what sets us apart.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                <div className="flex items-center gap-x-3">
                  <SparklesIcon className="h-8 w-8 text-[#D5FC51]" aria-hidden="true" />
                  <h3 className="text-xl font-semibold leading-7 text-[#2A2A2A]">State-of-the-art Facilities</h3>
                </div>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  Our gyms feature the latest equipment, spacious workout areas, and premium amenities for a superior fitness experience.
                </p>
              </div>
              <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                <div className="flex items-center gap-x-3">
                  <UserGroupIcon className="h-8 w-8 text-[#D5FC51]" aria-hidden="true" />
                  <h3 className="text-xl font-semibold leading-7 text-[#2A2A2A]">Expert Trainers</h3>
                </div>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  Our certified trainers are passionate about helping you achieve your goals with personalized guidance and support.
                </p>
              </div>
              <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                <div className="flex items-center gap-x-3">
                  <CheckCircleIcon className="h-8 w-8 text-[#D5FC51]" aria-hidden="true" />
                  <h3 className="text-xl font-semibold leading-7 text-[#2A2A2A]">Diverse Programs</h3>
                </div>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  From group classes to personal training, we offer a wide range of programs to suit every fitness level and goal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#2A2A2A]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to start your fitness journey?</h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Join SixStar Fitness today and experience the difference our community can make in your fitness journey.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/membership/plans"
                className="rounded-md bg-[#D5FC51] px-6 py-3 text-base font-semibold text-[#2A2A2A] shadow-sm hover:bg-[#c2e94a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D5FC51]"
              >
                View Membership Plans
              </Link>
              <Link
                href="/contact"
                className="text-base font-semibold leading-6 text-white hover:text-[#D5FC51]"
              >
                Contact Us <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
