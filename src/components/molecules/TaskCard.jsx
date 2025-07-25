import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const TaskCard = ({ task, onComplete, onEdit }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "success";
      default: return "default";
    }
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case "watering": return "Droplets";
      case "fertilizing": return "Beaker";
      case "harvesting": return "Scissors";
      case "planting": return "Sprout";
      case "weeding": return "Trash2";
      default: return "CheckSquare";
    }
  };

  return (
    <Card className={`p-4 ${task.completed ? "opacity-75 bg-gray-50" : ""}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            task.completed ? "bg-success/10" : "bg-forest/10"
          }`}>
            <ApperIcon 
              name={task.completed ? "CheckCircle" : getTaskIcon(task.type)} 
              className={`w-5 h-5 ${task.completed ? "text-success" : "text-forest"}`} 
            />
          </div>
          <div>
            <h4 className={`font-semibold ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
              {task.title}
            </h4>
            <p className="text-sm text-gray-600 capitalize">{task.type}</p>
          </div>
        </div>
        <Badge variant={getPriorityColor(task.priority)} className="capitalize">
          {task.priority}
        </Badge>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Calendar" className="w-4 h-4" />
          <span>Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {!task.completed && (
            <Button 
              size="sm" 
              variant="success"
              onClick={() => onComplete(task.Id)}
            >
              <ApperIcon name="Check" className="w-4 h-4 mr-1" />
              Complete
            </Button>
          )}
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => onEdit(task)}
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;