import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const CropForm = ({ crop, farms, onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
    farmId: "",
    cropType: "",
    field: "",
    plantingDate: "",
    expectedHarvest: "",
    status: "planted",
    season: "",
    cropVariety: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cropTypes = [
    "Corn", "Wheat", "Soybeans", "Rice", "Barley", "Oats", "Potatoes", 
    "Tomatoes", "Carrots", "Lettuce", "Spinach", "Broccoli", "Beans", "Peas"
  ];

  useEffect(() => {
if (crop) {
      setFormData({
        farmId: crop.farmId,
        cropType: crop.cropType,
        field: crop.field,
        plantingDate: format(new Date(crop.plantingDate), "yyyy-MM-dd"),
        expectedHarvest: format(new Date(crop.expectedHarvest), "yyyy-MM-dd"),
        status: crop.status,
        season: crop.season || "",
        cropVariety: crop.cropVariety || ""
      });
    }
  }, [crop]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        plantingDate: new Date(formData.plantingDate).toISOString(),
        expectedHarvest: new Date(formData.expectedHarvest).toISOString()
      });
      
      if (!crop) {
        setFormData({
          farmId: "",
          cropType: "",
          field: "",
          plantingDate: "",
          expectedHarvest: "",
          status: "planted"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {crop ? "Edit Crop" : "Add New Crop"}
        </h3>
        {onCancel && (
          <Button variant="secondary" size="sm" onClick={onCancel}>
            <ApperIcon name="X" className="w-4 h-4" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Crop Type"
            name="cropType"
            value={formData.cropType}
            onChange={handleChange}
            required
          >
            <option value="">Select crop type</option>
            {cropTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>

          <Input
            label="Field/Section"
            name="field"
            value={formData.field}
            onChange={handleChange}
            placeholder="e.g., North Field A"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Planting Date"
            name="plantingDate"
            type="date"
            value={formData.plantingDate}
            onChange={handleChange}
            required
          />

          <Input
            label="Expected Harvest"
            name="expectedHarvest"
            type="date"
            value={formData.expectedHarvest}
            onChange={handleChange}
            required
/>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Season"
            name="season"
            value={formData.season}
            onChange={handleChange}
          >
            <option value="">Select season</option>
            <option value="Kharif">Kharif</option>
            <option value="Rabi">Rabi</option>
            <option value="Dry">Dry</option>
          </Select>

          <Input
            label="Crop Variety"
            name="cropVariety"
            value={formData.cropVariety}
            onChange={handleChange}
            placeholder="e.g., Hybrid Corn, Basmati Rice"
          />
        </div>
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="planted">Planted</option>
          <option value="growing">Growing</option>
          <option value="ready">Ready to Harvest</option>
          <option value="harvested">Harvested</option>
        </Select>

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
                {crop ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>
                <ApperIcon name={crop ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
                {crop ? "Update Crop" : "Add Crop"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CropForm;