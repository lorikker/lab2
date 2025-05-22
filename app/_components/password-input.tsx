"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface PasswordInputProps {
  id: string;
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
  className?: string;
  label?: string;
  icon?: React.ReactNode;
}

export default function PasswordInput({
  id,
  name,
  placeholder = "Enter password",
  value,
  onChange,
  required = false,
  minLength,
  className = "",
  label,
  icon,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const baseInputClasses = "peer block w-full rounded-md border border-[#D9D9D9] py-[9px] text-sm text-[#2A2A2A] placeholder:text-gray-500 focus:border-[#D5FC51] focus:ring-1 focus:ring-[#D5FC51] focus:outline-none";
  const inputClasses = icon 
    ? `${baseInputClasses} pl-10 ${className}` 
    : `${baseInputClasses} ${className}`;

  return (
    <div>
      {label && (
        <label
          className="mt-5 mb-3 block text-xs font-medium text-[#2A2A2A]"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#2A2A2A] peer-focus:text-[#D5FC51]">
            {icon}
          </div>
        )}
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          minLength={minLength}
          className={inputClasses}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
          tabIndex={-1} // Prevent tab focus on the button
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <EyeIcon className="h-5 w-5" aria-hidden="true" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </button>
      </div>
    </div>
  );
}
