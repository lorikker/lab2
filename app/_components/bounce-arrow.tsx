"use client";

export default function BounceArrow() {
  return (
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
  );
}
