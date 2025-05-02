"use client"

import { forwardRef } from "react"

const Badge = forwardRef(({ className = "", variant = "default", size = "md", children, ...props }, ref) => {

  const baseStyles = "inline-flex items-center rounded-full font-medium"


  const variantStyles = {
    default: "bg-slate-100 text-slate-800",
    primary: "bg-primary bg-opacity-10 text-primary",
    secondary: "bg-secondary bg-opacity-10 text-secondary",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
  }


  const sizeStyles = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
  }


  const badgeStyles = [baseStyles, variantStyles[variant], sizeStyles[size], className].join(" ")

  return (
    <span ref={ref} className={badgeStyles} {...props}>
      {children}
    </span>
  )
})
Badge.displayName = "Badge"

export { Badge }
