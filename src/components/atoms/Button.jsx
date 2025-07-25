import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md", 
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]";
  
  const variants = {
    primary: "bg-gradient-to-r from-forest to-forest/90 text-white hover:from-forest/90 hover:to-forest shadow-md focus:ring-forest/50",
    secondary: "border-2 border-forest text-forest hover:bg-forest hover:text-white focus:ring-forest/50",
    success: "bg-gradient-to-r from-success to-success/90 text-white hover:from-success/90 hover:to-success shadow-md focus:ring-success/50",
    warning: "bg-gradient-to-r from-warning to-warning/90 text-white hover:from-warning/90 hover:to-warning shadow-md focus:ring-warning/50",
    danger: "bg-gradient-to-r from-error to-error/90 text-white hover:from-error/90 hover:to-error shadow-md focus:ring-error/50",
    harvest: "harvest-gradient text-white hover:shadow-lg focus:ring-harvest/50"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  
  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;