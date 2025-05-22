import MembershipLayout from "@/app/_components/membership-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Basic Membership - FitnessHub",
  description: "Our Basic membership plan provides essential access to our gym facilities",
};

export default function BasicMembershipPage() {
  return (
    <MembershipLayout
      title="Basic"
      price="29.99"
      description="Our Basic membership plan provides essential access to our gym facilities and equipment, perfect for beginners or those with a limited budget."
      features={[
        "Access to gym floor during regular hours (5am-11pm)",
        "Use of all basic equipment including cardio machines and free weights",
        "Locker room access with showers and changing facilities",
        "Free water station and towel service",
        "Access to fitness assessment once per quarter",
        "Discounted rates for personal training sessions",
        "Access to online workout resources",
        "Free parking during your workout"
      ]}
      benefits={[
        {
          title: "Affordable Fitness",
          description: "Get access to quality fitness facilities without breaking the bank. Our Basic plan is designed to be accessible to everyone."
        },
        {
          title: "Flexible Hours",
          description: "With access from 5am to 11pm, you can work out at a time that suits your schedule, whether you're an early bird or a night owl."
        },
        {
          title: "Essential Equipment",
          description: "All the equipment you need for a complete workout, including cardio machines, free weights, and functional training areas."
        },
        {
          title: "Clean Facilities",
          description: "Enjoy clean, well-maintained locker rooms with showers, changing areas, and secure storage for your belongings."
        },
        {
          title: "Upgrade Anytime",
          description: "Start with Basic and upgrade to Premium or Elite whenever you're ready to take your fitness journey to the next level."
        },
        {
          title: "Community Support",
          description: "Join a community of like-minded individuals all working towards their fitness goals in a supportive environment."
        }
      ]}
      callToAction="Join Basic Plan Now"
      backgroundImage="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    />
  );
}
