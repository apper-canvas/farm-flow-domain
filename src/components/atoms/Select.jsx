import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ 
  children, 
  className, 
  label,
  error,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-lg",
          "focus:outline-none focus:ring-2 focus:ring-forest/50 focus:border-forest",
          "transition-colors duration-200 bg-white",
          error && "border-error focus:ring-error/50 focus:border-error",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;