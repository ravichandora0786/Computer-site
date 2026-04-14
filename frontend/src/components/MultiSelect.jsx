import React from "react";
import Select from "react-select";
import clsx from "clsx";

const MultiSelect = ({
  label,
  options = [],
  value,
  onChange,
  className = "",
  error,
  placeholder = "Select options...",
  isMulti = true,
  ...props
}) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: "0.5rem",
      borderColor: error
        ? "#ef4444"
        : state.isFocused
        ? "#3b82f6"
        : "#e5e7eb",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(59, 130, 246, 0.2)"
        : "none",
      "&:hover": {
        borderColor: error ? "#ef4444" : "#3b82f6",
      },
      backgroundColor: "white",
      padding: "2px",
      fontSize: "0.875rem",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
        ? "#eff6ff"
        : "white",
      color: state.isSelected ? "white" : "#374151",
      fontSize: "0.875rem",
      "&:active": {
        backgroundColor: "#3b82f6",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#eff6ff",
      borderRadius: "0.375rem",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#1e40af",
      fontWeight: "500",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#1e40af",
      "&:hover": {
        backgroundColor: "#dbeafe",
        color: "#1e3a8a",
      },
    }),
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <Select
        isMulti={isMulti}
        options={options}
        value={value}
        onChange={onChange}
        styles={customStyles}
        placeholder={placeholder}
        className={clsx("w-full", className)}
        {...props}
      />
      {error && <span className="text-xs font-medium text-red-500">{error}</span>}
    </div>
  );
};

export default MultiSelect;
