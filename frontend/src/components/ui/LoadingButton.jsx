"use client";
import React from "react";
import clsx from "clsx";

const LoadingButton = ({
  children,
  isLoading = false,
  disabled = false,
  className = "",
  variant = "primary",
  ...props
}) => {
  const baseClasses = `inline-flex items-center justify-center gap-2 whitespace-nowrap 
        text-sm font-semibold transition-all focus-visible:outline-none 
        focus-visible:ring-2 focus-visible:ring-primary/50 
        disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
        `;

  const variantClasses = {
    primary:
      "bg-primary text-white hover:bg-[#E64529] hover:-translate-y-0.5 active:scale-95 w-full px-5 py-2.5 rounded-xl shadow-md shadow-primary/20",
    secondary:
      "bg-gray-300 hover:bg-gray-400 text-[#111111] active:scale-95 px-5 py-2.5 rounded-xl transition-all duration-200",
    danger: "bg-red-600 text-white hover:bg-red-700 active:scale-95 px-5 py-2.5 rounded-xl",
    custom: className,
  };

  return (
    <button
      disabled={isLoading || disabled}
      className={clsx(baseClasses, variantClasses[variant] || variantClasses.primary, className)}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {isLoading ? "Processing..." : children}
    </button>
  );
};

export default LoadingButton;
