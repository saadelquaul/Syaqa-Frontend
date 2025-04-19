"use client"

import { forwardRef } from "react"


const Table = forwardRef(({ className = "", ...props }, ref) => {
  return (
    <div className="w-full overflow-auto">
      <table ref={ref} className={`w-full caption-bottom text-sm ${className}`} {...props} />
    </div>
  )
})
Table.displayName = "Table"


const TableHeader = forwardRef(({ className = "", ...props }, ref) => {
  return <thead ref={ref} className={`border-b border-slate-200 ${className}`} {...props} />
})
TableHeader.displayName = "TableHeader"

const TableBody = forwardRef(({ className = "", ...props }, ref) => {
  return <tbody ref={ref} className={`divide-y divide-slate-200 ${className}`} {...props} />
})
TableBody.displayName = "TableBody"


const TableRow = forwardRef(({ className = "", ...props }, ref) => {
  return (
    <tr ref={ref} className={`border-b border-slate-200 transition-colors hover:bg-slate-50 ${className}`} {...props} />
  )
})
TableRow.displayName = "TableRow"

const TableHead = forwardRef(({ className = "", ...props }, ref) => {
  return (
    <th ref={ref} className={`h-12 px-4 text-left align-middle font-medium text-slate-500 ${className}`} {...props} />
  )
})
TableHead.displayName = "TableHead"


const TableCell = forwardRef(({ className = "", ...props }, ref) => {
  return <td ref={ref} className={`p-4 align-middle ${className}`} {...props} />
})
TableCell.displayName = "TableCell"

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
