import React from "react";

const Progress = React.forwardRef(({ className, value = 0, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-100 ${className}`}
      {...props}
    >
      <div
        className="h-full bg-blue-500 transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
});

Progress.displayName = "Progress";

export { Progress };