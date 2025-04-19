"use client"

import { forwardRef } from "react"



const Avatar = forwardRef(({ className = "", src, alt = "Avatar", size = "md", fallback, ...props }, ref) => {
  // Size styles with dimensions
  const sizeStyles = {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  // Combine all styles
  const avatarStyles = ["relative inline-block rounded-full overflow-hidden", sizeStyles[size], className].join(" ")

  // Get the initials from the alt text for the fallback
  const getInitials = () => {
    if (fallback) return fallback
    return alt
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div ref={ref} className={avatarStyles} {...props}>
      {src ? (
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          className="object-cover"
          onError={(e) => {
            // If image fails to load, show fallback
            e.target.style.display = "none"
            e.target.nextSibling.style.display = "flex"
          }}
        />
      ) : null}

      {/* Fallback for when image fails to load or no src provided */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-600 ${
          src ? "hidden" : ""
        }`}
      >
        {getInitials()}
      </div>
    </div>
  )
})
Avatar.displayName = "Avatar"

export { Avatar }
