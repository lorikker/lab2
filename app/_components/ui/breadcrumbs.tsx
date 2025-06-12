import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

interface BreadcrumbsProps {
  breadcrumbs: BreadcrumbItem[];
}

export default function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
          {breadcrumb.active ? (
            <span className="font-medium text-[#2A2A2A]">{breadcrumb.label}</span>
          ) : (
            <Link 
              href={breadcrumb.href} 
              className="hover:text-[#D5FC51] transition-colors"
            >
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}