import { cn } from "../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        "flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}
