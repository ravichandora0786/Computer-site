import React from "react";
import clsx from "clsx";

const ActionIcon = ({ 
  icon: Icon, 
  onClick, 
  variant = "primary", // primary, danger, success, info
  title = "",
  size = 20
}) => {
  const variants = {
    primary: "text-blue-600 hover:bg-blue-50",
    danger: "text-red-600 hover:bg-red-50",
    success: "text-emerald-600 hover:bg-emerald-50",
    info: "text-cyan-600 hover:bg-cyan-50",
    secondary: "text-gray-400 hover:bg-gray-100",
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(e);
      }}
      title={title}
      className={clsx(
        "p-2.5 rounded-[10px] transition-all duration-200 flex items-center justify-center",
        variants[variant] || variants.primary
      )}
    >
      <Icon size={size} />
    </button>
  );
};

export default ActionIcon;
