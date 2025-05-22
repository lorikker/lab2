import MembershipLayout from "@/app/_components/membership-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Membership - FitnessHub",
  description: "Our Premium membership plan offers enhanced fitness services and personalized guidance",
};

export default function PremiumMembershipPage() {
  return (
    <MembershipLayout
      title="Premium"
      price="49.99"
      description="Take your fitness to the next level with our Premium membership plan, featuring group classes, personalized workout plans, and nutrition guidance."
      features={[
        "All Basic plan features included",
        "24/7 access to the gym facilities",
        "Unlimited access to group fitness classes",
        "Personalized workout plan created by certified trainers",
        "Monthly fitness assessment and progress tracking",
        "Nutrition consultation and basic meal planning",
        "Access to exclusive Premium member areas",
        "Discounted rates on specialty programs and workshops",
        "Guest passes (2 per month)",
        "Priority booking for classes and facilities"
      ]}
      benefits={[
        {
          title: "Comprehensive Fitness",
          description: "Get a well-rounded fitness experience with access to both individual workouts and group classes led by expert instructors."
        },
        {
          title: "Personalized Guidance",
          description: "Receive a customized workout plan designed specifically for your goals, fitness level, and preferences."
        },
        {
          title: "Nutritional Support",
          description: "Complement your workouts with professional nutrition guidance to maximize your results and overall health."
        },
        {
          title: "24/7 Access",
          description: "Work out whenever it suits you with round-the-clock access to our facilities, perfect for busy professionals."
        },
        {
          title: "Community Classes",
          description: "Join motivating group classes that make fitness fun and help you stay accountable to your goals."
        },
        {
          title: "Progress Tracking",
          description: "Regular assessments help you see your improvements and keep you motivated on your fitness journey."
        }
      ]}
      callToAction="Join Premium Plan Now"
      backgroundImage="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    />
  );
}
