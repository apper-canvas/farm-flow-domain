import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item", 
  actionLabel = "Add Item",
  onAction,
  icon = "Inbox"
}) => {
  return (
    <Card className="p-8 text-center max-w-md mx-auto">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="w-8 h-8 text-forest" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
        {onAction && (
          <Button onClick={onAction} variant="primary">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Empty;