"use client"

import { forwardRef } from "react"

const Input = forwardRef(({ className = "", error, leftIcon, rightIcon, ...props }, ref) => {
  // Base input styles
  const baseStyles =
    "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

  // Error styles
  const errorStyles = error ? "border-red-500 focus:ring-red-500" : ""

  // Icon padding styles
  const leftPadding = leftIcon ? "pl-10" : ""
  const rightPadding = rightIcon ? "pr-10" : ""

  // Combine all styles
  const inputStyles = [baseStyles, errorStyles, leftPadding, rightPadding, className].join(" ")

  return (
    <div className="relative">
      {leftIcon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
          {leftIcon}
        </div>
      )}

      <input ref={ref} className={inputStyles} {...props} />

      {rightIcon && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
          {rightIcon}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
})
Input.displayName = "Input"

export { Input }
