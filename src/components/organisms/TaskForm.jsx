import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const TaskForm = ({ task, farms, crops, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    farmId: "",
    cropId: "",
    title: "",
    type: "",
    dueDate: "",
    priority: "medium",
    completed: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredCrops, setFilteredCrops] = useState([]);

  const taskTypes = [
    "watering", "fertilizing", "harvesting", "planting", "weeding", 
    "spraying", "inspection", "maintenance", "other"
  ];

  useEffect(() => {
    if (task) {
      setFormData({
        farmId: task.farmId,
        cropId: task.cropId || "",
        title: task.title,
        type: task.type,
        dueDate: format(new Date(task.dueDate), "yyyy-MM-dd"),
        priority: task.priority,
        completed: task.completed
      });
    }
  }, [task]);

  useEffect(() => {
    if (formData.farmId) {
      const farmCrops = crops.filter(crop => crop.farmId === parseInt(formData.farmId));
      setFilteredCrops(farmCrops);
    } else {
      setFilteredCrops([]);
    }
  }, [formData.farmId, crops]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        farmId: parseInt(formData.farmId),
        cropId: formData.cropId ? parseInt(formData.cropId) : null,
        dueDate: new Date(formData.dueDate).toISOString()
      });
      
      if (!task) {
        setFormData({
          farmId: "",
          cropId: "",
          title: "",
          type: "",
          dueDate: "",
          priority: "medium",
          completed: false
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {task ? "Edit Task" : "Add New Task"}
        </h3>
        {onCancel && (
          <Button variant="secondary" size="sm" onClick={onCancel}>
            <ApperIcon name="X" className="w-4 h-4" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Water tomatoes in greenhouse"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Task Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Select task type</option>
            {taskTypes.map(type => (
              <option key={type} value={type} className="capitalize">{type}</option>
            ))}
          </Select>

          <Select
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </div>

        <Select
          label="Farm"
          name="farmId"
          value={formData.farmId}
          onChange={handleChange}
          required
        >
          <option value="">Select a farm</option>
          {farms.map(farm => (
            <option key={farm.Id} value={farm.Id}>{farm.name}</option>
          ))}
        </Select>

        {filteredCrops.length > 0 && (
          <Select
            label="Related Crop (Optional)"
            name="cropId"
            value={formData.cropId}
            onChange={handleChange}
          >
            <option value="">Select a crop (optional)</option>
            {filteredCrops.map(crop => (
              <option key={crop.Id} value={crop.Id}>
                {crop.cropType} - {crop.field}
              </option>
            ))}
          </Select>
        )}

        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          required
        />

        {task && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="completed"
              name="completed"
              checked={formData.completed}
              onChange={handleChange}
              className="w-4 h-4 text-forest bg-gray-100 border-gray-300 rounded focus:ring-forest/50"
            />
            <label htmlFor="completed" className="text-sm text-gray-700">
              Mark as completed
            </label>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                {task ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>
                <ApperIcon name={task ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
                {task ? "Update Task" : "Add Task"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TaskForm;