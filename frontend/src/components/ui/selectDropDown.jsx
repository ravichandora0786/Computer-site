import React from "react";
import Select from "react-select";

export default function SelectDropDown({
  label,
  name,
  options = [],
  value,
  error,
  placeholder = "Select...",
  isSearchable = false,
  isClearable = false,
  onChange,
  disabled = false,
  touched = true,
  isMulti = false,
  onBlur,
}) {
  const hasError = !!error;

  // Compatibility Layer: Convert primitive string value to {label, value} object
  const getSelectValue = () => {
    if (!value) return null;
    if (isMulti && Array.isArray(value)) {
      return options.filter((opt) => value.includes(opt.value));
    }
    return options.find((opt) => opt.value === value) || null;
  };

  // Compatibility Layer: Send back primitive value in a fake event object
  const handleSelectChange = (selected) => {
    let val;
    if (isMulti) {
      val = selected ? selected.map((s) => s.value) : [];
    } else {
      val = selected ? selected.value : "";
    }

    const fakeEvent = {
      target: { name, value: val },
      preventDefault: () => { },
      stopPropagation: () => { }
    };

    onChange(fakeEvent);
  };

  const currentSelectValue = getSelectValue();

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="text-xs font-bold uppercase text-muted mb-2 block">
          {label}
        </label>
      )}

      <Select
        options={options}
        placeholder={placeholder}
        isClearable={isClearable}
        isSearchable={isSearchable}
        menuPortalTarget={document.body}
        name={name}
        onBlur={onBlur}
        isDisabled={disabled}
        value={currentSelectValue}
        onChange={handleSelectChange}
        isMulti={isMulti}
        menuPlacement="auto"
        className="text-sm"
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          control: (provided, state) => ({
            ...provided,
            minHeight: "42px",
            border: hasError
              ? "1px solid #ef4444"
              : state.isFocused
                ? "1px solid var(--color-primary)"
                : "1px solid var(--border-line)",
            borderRadius: "0.75rem",
            backgroundColor: "var(--bg-card)",
            boxShadow: state.isFocused
              ? "0 0 0 2px rgba(255, 77, 45, 0.1)"
              : "0 1px 2px 0 rgb(0 0 0 / 0.05)", // shadow-sm equivalent
            "&:hover": {
              borderColor: hasError ? "#ef4444" : "var(--color-primary)",
              cursor: "pointer",
            },
            outline: "none",
          }),

          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
              ? "var(--color-primary)"
              : state.isFocused
                ? "rgba(255, 77, 45, 0.05)"
                : "transparent",
            color: state.isSelected
              ? "#fff"
              : state.isFocused
                ? "var(--color-primary)"
                : "var(--text-main)",
            padding: "10px 16px",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            "&:active": {
              backgroundColor: "var(--color-primary)",
              color: "#fff",
            }
          }),

          singleValue: (provided) => ({
            ...provided,
            color: "var(--text-main)",
            fontSize: "14px",
            fontWeight: "500",
          }),

          multiValue: (provided) => ({
            ...provided,
            backgroundColor: "var(--color-primary)",
            borderRadius: "0.4rem",
            color: "#fff",
          }),

          multiValueLabel: (provided) => ({
            ...provided,
            color: "#fff",
            fontSize: "12px",
          }),

          placeholder: (provided) => ({
            ...provided,
            color: "var(--text-muted)",
          }),

          dropdownIndicator: (provided) => ({
            ...provided,
            padding: "8px",
            color: hasError ? "#ef4444" : "var(--color-primary)",
          }),

          indicatorSeparator: () => ({ display: "none" }),
        }}
      />

      {hasError && (
        <div className="mt-1 text-[10px] font-bold text-red-500 uppercase tracking-tight">
          {error}
        </div>
      )}
    </div>
  );
}
