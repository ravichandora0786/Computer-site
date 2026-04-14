import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

const ToggleButton = ({
  checked = false,
  onChange,
  disabled = false,
  isLoading = false,
  label = "",
  size = "md",
}) => {
  const toggleSize = {
    sm: "w-8 h-4.5 p-0.5",
    md: "w-11 h-6 p-1",
    lg: "w-14 h-8 p-1.5",
  };

  const circleSize = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled && !isLoading && onChange) onChange(!checked);
        }}
        disabled={disabled || isLoading}
        className={clsx(
          "relative inline-flex flex-shrink-0 cursor-pointer rounded-full transition-all duration-300 ease-in-out focus:outline-none ring-offset-2 focus:ring-2 focus:ring-primary/20",
          toggleSize[size],
          checked 
            ? "bg-gradient-to-r from-emerald-500 to-teal-600 shadow-sm" 
            : "bg-gray-200 dark:bg-gray-700",
          (disabled || isLoading) && "opacity-50 cursor-not-allowed"
        )}
      >
        <span className="sr-only">Toggle status</span>
        <motion.span
          layout
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
          className={clsx(
            "pointer-events-none inline-block transform rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] ring-0",
            circleSize[size],
            checked 
              ? (size === "sm" ? "translate-x-3.5" : size === "md" ? "translate-x-5" : "translate-x-6") 
              : "translate-x-0"
          )}
        >
          {isLoading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <svg className="h-2 w-2 animate-spin text-primary" viewBox="0 0 12 12">
                <circle className="opacity-25" cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </span>
          )}
        </motion.span>
      </button>
      {label && (
        <span className={clsx(
          "text-sm font-bold select-none tracking-tight",
          checked ? "text-emerald-600" : "text-gray-400"
        )}>
          {label}
        </span>
      )}
    </div>
  );
};

export default ToggleButton;
