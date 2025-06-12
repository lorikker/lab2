import Link from "next/link";

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  isPopular: boolean;
}

export default function PricingCard({ title, price, features, isPopular }: PricingCardProps) {
  return (
    <div
      className={`relative rounded-lg p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
        isPopular
          ? "border-2 border-[#D5FC51] bg-[#D5FC51] text-[#2A2A2A]"
          : "border border-[#D9D9D9] bg-white text-[#2A2A2A]"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#2A2A2A] px-4 py-1 text-sm font-medium text-white">
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
      <Link
        href="/membership"
        className={`block w-full rounded-md px-4 py-2 text-center font-medium transition-colors ${
          isPopular
            ? "bg-[#2A2A2A] text-white hover:bg-[#2A2A2A]/90"
            : "bg-[#D5FC51] text-[#2A2A2A] hover:opacity-90"
        }`}
      >
        Choose Plan
      </Link>
    </div>
  );
}
