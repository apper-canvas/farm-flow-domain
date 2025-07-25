import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  className,
  iconBg = "bg-forest/10",
  iconColor = "text-forest"
}) => {
  return (
    <Card className={cn("p-6", className)} hover>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-forest to-forest/80 bg-clip-text text-transparent">
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                className={cn(
                  "w-4 h-4 mr-1",
                  trend === "up" ? "text-success" : "text-error"
                )} 
              />
              <span className={cn(
                "text-sm font-medium",
                trend === "up" ? "text-success" : "text-error"
              )}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", iconBg)}>
          <ApperIcon name={icon} className={cn("w-6 h-6", iconColor)} />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;