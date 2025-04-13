import React from "react"

export function Button({ className, children, ...props }) {
  return (
    <button 
      className={`flex items-center justify-center rounded-md bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800 transition-colors ${className || ""}`} 
      {...props}
    >
      {children}
    </button>
  )
}