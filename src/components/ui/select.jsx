"use client"

import { forwardRef } from "react"
import { ChevronDown } from "lucide-react"


const Select = forwardRef(
  (
    {
      options = [],
      value,
      onChange,
      placeholder = "Select an option",
      className = "",
      error,
      leftIcon,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    // Base select styles
    const baseStyles =
      "flex h-10 w-full appearance-none rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

    // Error styles
    const errorStyles = error ? "border-red-500 focus:ring-red-500" : ""

    // Icon padding styles
    const leftPadding = leftIcon ? "pl-10" : ""

    // Combine all styles
    const selectStyles = [
      baseStyles,
      errorStyles,
      leftPadding,
      "pr-10", // Always add right padding for the dropdown icon
      className,
    ].join(" ")

    // Find the selected option's label
    // const selectedOption = options.find((option) => option.value === value)

    // Handle change event
    const handleChange = (e) => {
      if (onChange) {
        onChange(e.target.value)
      }
    }

    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}

        <select
          ref={ref}
          className={selectStyles}
          value={value || ""}
          onChange={handleChange}
          disabled={disabled}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-slate-400">
          <ChevronDown className="h-4 w-4" />
        </div>

        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    )
  },
)
Select.displayName = "Select"

export { Select }
