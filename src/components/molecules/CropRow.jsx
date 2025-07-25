import React from "react";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const CropRow = ({ crop, farmName, onEdit, onDelete }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "planted": return "planted";
      case "growing": return "growing";
      case "ready": return "ready";
      default: return "default";
    }
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-leaf/10 rounded-lg flex items-center justify-center">
            <ApperIcon name="Sprout" className="w-5 h-5 text-leaf" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{crop.cropType}</p>
            <p className="text-sm text-gray-600">{crop.field}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">{farmName}</td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {format(new Date(crop.plantingDate), "MMM dd, yyyy")}
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {format(new Date(crop.expectedHarvest), "MMM dd, yyyy")}
      </td>
      <td className="px-6 py-4">
        <Badge variant={getStatusVariant(crop.status)} className="capitalize">
          {crop.status}
        </Badge>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="secondary" onClick={() => onEdit(crop)}>
            <ApperIcon name="Edit" className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="danger" onClick={() => onDelete(crop.Id)}>
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default CropRow;