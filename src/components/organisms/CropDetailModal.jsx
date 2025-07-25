import React from "react";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CropDetailModal = ({ crop, farmName, isOpen, onClose }) => {
  if (!isOpen || !crop) return null;

  const growthStages = [
    {
      stage: "Planted",
      date: crop.plantingDate,
      status: "completed",
      description: "Seeds planted in field"
    },
    {
      stage: "Germination", 
      date: crop.germinationDate || addDays(crop.plantingDate, 7),
      status: crop.timeline?.germination || "completed",
      description: "Seeds sprouting from soil"
    },
    {
      stage: "Vegetative Growth",
      date: crop.vegetativeDate || addDays(crop.plantingDate, 21),
      status: crop.timeline?.vegetative || (crop.status === "growing" ? "current" : "completed"),
      description: "Leaf and stem development"
    },
    {
      stage: "Flowering",
      date: crop.floweringDate || addDays(crop.plantingDate, 60),
      status: crop.timeline?.flowering || (crop.status === "ready" ? "completed" : "pending"),
      description: "Reproductive phase begins"
    },
    {
      stage: "Harvest Ready",
      date: crop.expectedHarvest,
      status: crop.status === "ready" ? "completed" : "pending",
      description: "Crop ready for harvesting"
    }
  ];

  const yieldHistory = crop.yieldHistory || [
    { year: 2021, yield: 85, unit: "tons/hectare" },
    { year: 2022, yield: 92, unit: "tons/hectare" },
    { year: 2023, yield: 88, unit: "tons/hectare" },
    { year: 2024, yield: 95, unit: "tons/hectare", projected: true }
  ];

  function addDays(dateString, days) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }

  const getStageProgress = () => {
    const completedStages = growthStages.filter(stage => stage.status === "completed").length;
    return (completedStages / growthStages.length) * 100;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "success";
      case "current": return "warning";
      default: return "default";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-900">
                {crop.cropType} Details
              </h2>
              <p className="text-gray-600">{crop.field} • {farmName}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Crop Overview */}
          <Card className="p-6">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
              Crop Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-600">Status</label>
                <div className="mt-1">
                  <Badge variant={crop.status}>{crop.status}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Planting Date</label>
                <p className="font-medium">{format(new Date(crop.plantingDate), "MMM dd, yyyy")}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Expected Harvest</label>
                <p className="font-medium">{format(new Date(crop.expectedHarvest), "MMM dd, yyyy")}</p>
              </div>
            </div>
          </Card>

          {/* Growth Timeline */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-semibold text-gray-900">
                Growth Timeline
              </h3>
              <div className="text-sm text-gray-600">
                {Math.round(getStageProgress())}% Complete
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-leaf h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getStageProgress()}%` }}
                ></div>
              </div>
            </div>

            {/* Timeline Steps */}
            <div className="space-y-4">
              {growthStages.map((stage, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    stage.status === "completed" && "bg-success text-white",
                    stage.status === "current" && "bg-warning text-white",
                    stage.status === "pending" && "bg-gray-200 text-gray-600"
                  )}>
                    {stage.status === "completed" ? (
                      <ApperIcon name="Check" className="w-4 h-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{stage.stage}</h4>
                      <Badge variant={getStatusColor(stage.status)} className="text-xs">
                        {stage.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(stage.date), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Historical Yield Data */}
          <Card className="p-6">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-6">
              Historical Yield Data
            </h3>
            
            <div className="space-y-4">
              {yieldHistory.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-leaf/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name="BarChart3" className="w-6 h-6 text-leaf" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {data.year} {data.projected && "(Projected)"}
                      </h4>
                      <p className="text-sm text-gray-600">{crop.cropType} Yield</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">{data.yield}</p>
                    <p className="text-sm text-gray-600">{data.unit}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Yield Chart Visualization */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Yield Trend</h4>
              <div className="relative h-32 bg-gray-50 rounded-lg p-4">
                <div className="flex items-end justify-between h-full">
                  {yieldHistory.map((data, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div className="text-xs text-gray-600">{data.yield}</div>
                      <div 
                        className="bg-leaf rounded-t-sm w-8 transition-all duration-300"
                        style={{ height: `${(data.yield / 100) * 80}px` }}
                      ></div>
                      <div className="text-xs text-gray-600">{data.year}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Additional Information */}
          <Card className="p-6">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Field Conditions</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Soil pH: 6.8 (Optimal)</li>
                  <li>• Irrigation: Drip system</li>
                  <li>• Fertilization: Organic compost</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Weather Impact</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Average rainfall: 45mm/week</li>
                  <li>• Temperature range: 18-28°C</li>
                  <li>• Growing degree days: 1,250</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl">
          <div className="flex justify-end">
            <Button onClick={onClose}>
              Close Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDetailModal;