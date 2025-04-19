"use client"

import { forwardRef } from "react"
import { Loader2 } from "lucide-react"

const Button = forwardRef(
  (
    {
      className = "",
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      rounded = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref,
  ) => {
    // Base button styles
    const baseStyles =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

    // Variant styles
    const variantStyles = {
      primary: "bg-primary text-white hover:bg-primary-dark",
      secondary: "bg-secondary text-white hover:bg-secondary-dark",
      outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
      "outline-secondary": "border-2 border-secondary text-secondary hover:bg-secondary hover:text-white",
      ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
      link: "bg-transparent underline-offset-4 hover:underline text-primary hover:text-primary-dark p-0",
      danger: "bg-red-600 text-white hover:bg-red-700",
      success: "bg-green-600 text-white hover:bg-green-700",
    }

    // Size styles
    const sizeStyles = {
      xs: "h-8 px-2.5 text-xs",
      sm: "h-9 px-3",
      md: "h-10 py-2 px-4",
      lg: "h-12 px-6 text-base",
      xl: "h-14 px-8 text-lg",
      icon: "h-10 w-10",
    }

    // Combine all styles
    const buttonStyles = [
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      fullWidth ? "w-full" : "",
      rounded ? "rounded-full" : "",
      className,
    ].join(" ")

    return (
      <button className={buttonStyles} ref={ref} disabled={disabled || isLoading} {...props}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  },
)
Button.displayName = "Button"

export { Button }
