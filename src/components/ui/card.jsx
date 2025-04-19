"use client"

import { forwardRef } from "react"


const Card = forwardRef(({ className = "", ...props }, ref) => {
    return <div ref={ref} className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`} {...props} />
})
Card.displayName = "Card"

const CardHeader = forwardRef(({ className = "", ...props }, ref) => {
    return <div ref={ref} className={`px-6 py-4 border-b border-slate-200 ${className}`} {...props} />
})
CardHeader.displayName = "CardHeader"

const CardTitle = forwardRef(({ className = "", ...props }, ref) => {
    return <h3 ref={ref} className={`text-lg font-semibold text-slate-900 ${className}`} {...props} />
})
CardTitle.displayName = "CardTitle"

const CardContent = forwardRef(({ className = "", ...props }, ref) => {
    return <div ref={ref} className={`px-6 py-4 ${className}`} {...props} />
})
CardContent.displayName = "CardContent"

const CardFooter = forwardRef(({ className = "", ...props }, ref) => {
    return <div ref={ref} className={`px-6 py-4 border-t border-slate-200 ${className}`} {...props} />
})
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardContent, CardFooter }
