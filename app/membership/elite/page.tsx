import MembershipLayout from "@/app/_components/membership-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Elite Membership - FitnessHub",
  description: "Our Elite membership plan offers the ultimate fitness experience with personal training and advanced health monitoring",
};

export default function EliteMembershipPage() {
  return (
    <MembershipLayout
      title="Elite"
      price="79.99"
      description="Experience the ultimate in fitness with our Elite membership plan, featuring personal training sessions, advanced health monitoring, and exclusive member benefits."
      features={[
        "All Premium plan features included",
        "Personal training sessions (2 per month)",
        "Advanced health and fitness assessments",
        "Comprehensive nutrition planning with a certified nutritionist",
        "Body composition analysis and tracking",
        "Priority access to all facilities and classes",
        "Exclusive access to Elite member lounge",
        "Complimentary towel and premium toiletry service",
        "Unlimited guest passes (4 per month)",
        "Access to exclusive member events and workshops",
        "Discounted rates on fitness retreats and special programs",
        "Recovery services including massage therapy sessions (1 per month)"
      ]}
      benefits={[
        {
          title: "Personal Attention",
          description: "Work directly with certified personal trainers who will guide, motivate, and push you to achieve your fitness goals."
        },
        {
          title: "Advanced Monitoring",
          description: "Track your progress with sophisticated health metrics and body composition analysis to optimize your fitness journey."
        },
        {
          title: "Complete Nutrition",
          description: "Receive comprehensive nutrition planning tailored to your specific needs, preferences, and fitness objectives."
        },
        {
          title: "Recovery Focus",
          description: "Enhance your results with recovery services that help your body repair and strengthen between workouts."
        },
        {
          title: "Exclusive Community",
          description: "Join a select group of dedicated fitness enthusiasts in special events, workshops, and our Elite member lounge."
        },
        {
          title: "Premium Experience",
          description: "Enjoy the highest level of service, amenities, and attention throughout your fitness journey with us."
        }
      ]}
      callToAction="Join Elite Plan Now"
      backgroundImage="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    />
  );
}
