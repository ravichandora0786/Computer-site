import React from "react";
import { Link } from "react-router-dom";
import { MdAdd } from "react-icons/md";
import clsx from "clsx";

/**
 * PrimaryButton Component
 * 
 * The standard action button for the 'Studio' aesthetic.
 * 
 * @param {string} name - The label text of the button
 * @param {string} link - The destination URL (if provided, renders a Link)
 * @param {function} onClick - The click handler (if provided and no link, renders a button)
 * @param {React.ElementType} icon - The icon component to display (defaults to MdAdd)
 * @param {string} className - Additional CSS classes
 * @param {boolean} disabled - Whether the button is disabled
 * @param {string} type - Button type (e.g., 'button', 'submit')
 */
const PrimaryButton = ({
  name,
  link,
  onClick,
  icon: Icon = MdAdd,
  className,
  disabled = false,
  type = "button shadow-xl shadow-primary/20"
}) => {
  const commonClasses = clsx(
    "bg-primary text-white p-2 sm:px-4 sm:py-2 rounded-[10px] shadow-xl shadow-primary/20 hover:scale-105 transition-all text-xs md:text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2 group disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed",
    className
  );

  const iconElement = Icon && <Icon size={20} className="group-hover:rotate-90 transition-transform" />;

  if (link) {
    return (
      <Link to={link} className={commonClasses}>
        {iconElement}
        <span className="hidden sm:inline">{name}</span>
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={commonClasses}
      disabled={disabled}
    >
      {iconElement}
      <span className="hidden sm:inline">{name}</span>
    </button>
  );
};

export default PrimaryButton;
