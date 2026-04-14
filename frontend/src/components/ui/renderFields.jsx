import React from "react";
import { Field, ErrorMessage } from "formik";
import clsx from "clsx";
import SelectDropDown from "./selectDropDown";
import MultiSelect from "../MultiSelect";
import ToggleButton from "./ToggleButton";
import StudioEditor from "./StudioEditor";

const RenderFields = ({ fields = [], setFieldValue, values, errors, touched }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-5 md:grid-cols-2">
      {fields.map((field) => {
        const { name, label, type, placeholder, options, className, disabled, fullWidth, required } = field;
        const isError = touched[name] && errors[name];

        const commonClass = clsx(
          "w-full rounded-[10px] border bg-gray-50/30 px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-primary/10 placeholder:text-gray-400 placeholder:font-normal",
          isError ? "border-red-400 focus:border-red-500 bg-red-50/30" : "border-gray-200 focus:border-primary/50 focus:bg-white",
          disabled && "bg-gray-100 cursor-not-allowed opacity-60",
          className
        );

        return (
          <div key={name} className={clsx("flex flex-col gap-1.5", fullWidth && "md:col-span-2")}>
            {label && (
              <label className="text-[10px] font-bold uppercase tracking-widest dark:text-white px-1">
                {label}
                {required && <span className="text-red-500 ml-1 font-bold">*</span>}
              </label>
            )}

            {type === "select" ? (
              <SelectDropDown
                name={name}
                options={options}
                value={values[name]}
                onChange={(e) => setFieldValue(name, e.target.value)}
                error={isError ? errors[name] : null}
                placeholder={placeholder}
                disabled={disabled}
              />
            ) : type === "multiselect" ? (
              <MultiSelect
                name={name}
                options={options}
                value={values[name]}
                onChange={(val) => setFieldValue(name, val)}
                error={isError ? errors[name] : null}
                placeholder={placeholder}
                disabled={disabled}
              />
            ) : type === "textarea" ? (
              <Field
                as="textarea"
                name={name}
                rows={4}
                className={commonClass}
                placeholder={placeholder}
                disabled={disabled}
              />
            ) : type === "toggle" ? (
              <ToggleButton
                checked={values[name]}
                onChange={(val) => setFieldValue(name, val)}
                disabled={disabled}
                label={values[name] ? "Active" : "Inactive"}
              />
            ) : type === "checkbox" ? (
              <div className="flex items-center gap-3 px-1 py-1">
                <input
                  type="checkbox"
                  id={name}
                  name={name}
                  checked={!!values[name]}
                  onChange={(e) => setFieldValue(name, e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary transition-all cursor-pointer"
                  disabled={disabled}
                />
                <label htmlFor={name} className="text-sm font-semibold text-gray-700 cursor-pointer select-none">
                  {values[name] ? "Yes" : "No"}
                </label>
              </div>
            ) : type === "editor" ? (
              <StudioEditor
                value={values[name]}
                onChange={(content) => setFieldValue(name, content)}
                placeholder={placeholder}
              />
            ) : (
              <Field
                type={type || "text"}
                name={name}
                className={commonClass}
                placeholder={placeholder}
                disabled={disabled}
              />
            )}

            {type !== "select" && type !== "multiselect" && (
              <ErrorMessage
                name={name}
                component="span"
                className="text-[10px] font-bold uppercase tracking-tight text-red-500 px-1 mt-1"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RenderFields;
