import { ReactNode } from "react";

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
}

export default function ServiceCard({ icon, title, description, color }: ServiceCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}></div>
      <div className="relative z-10">
        <div className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${color} text-white`}>
          {icon}
        </div>
        <h3 className="mb-3 text-xl font-bold text-[#2A2A2A]">{title}</h3>
        <p className="text-[#2A2A2A]">{description}</p>
      </div>
    </div>
  );
}
