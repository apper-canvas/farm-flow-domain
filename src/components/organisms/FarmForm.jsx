import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FarmForm = ({ farm, onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
    name: "",
    size: "",
    sizeUnit: "acres",
    location: "",
    soilType: "",
    farmType: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

useEffect(() => {
    if (farm) {
      setFormData({
        name: farm.name,
        size: farm.size.toString(),
        sizeUnit: farm.sizeUnit,
        location: farm.location,
        soilType: farm.soilType || "",
        farmType: farm.farmType || "",
        notes: farm.notes || ""
      });
    }
  }, [farm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
try {
      await onSubmit({
        ...formData,
        size: parseFloat(formData.size)
      });
      
if (!farm) {
        setFormData({
          name: "",
          size: "",
          sizeUnit: "acres",
          location: "",
          soilType: "",
          farmType: "",
          notes: ""
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={onCancel}
      ></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <Card className="p-6 shadow-none border-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {farm ? "Edit Farm" : "Add New Farm"}
            </h3>
            {onCancel && (
              <Button variant="secondary" size="sm" onClick={onCancel}>
                <ApperIcon name="X" className="w-4 h-4" />
              </Button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Farm Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., North Field Farm"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Size"
                name="size"
                type="number"
                step="0.1"
                value={formData.size}
                onChange={handleChange}
                placeholder="e.g., 25.5"
                required
              />
              <Select
                label="Unit"
                name="sizeUnit"
                value={formData.sizeUnit}
                onChange={handleChange}
              >
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
                <option value="square-feet">Square Feet</option>
                <option value="square-meters">Square Meters</option>
              </Select>
            </div>
<Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., County, State"
              required
            />

<Select
              label="Soil Type"
              name="soilType"
              value={formData.soilType}
              onChange={handleChange}
            >
              <option value="">Select soil type</option>
              <option value="clay">Clay</option>
              <option value="sandy">Sandy</option>
              <option value="loamy">Loamy</option>
            </Select>

<Select
              label="Farm Type"
              name="farmType"
              value={formData.farmType}
              onChange={handleChange}
            >
              <option value="">Select farm type</option>
              <option value="crop farm">Crop Farm</option>
              <option value="dairy">Dairy</option>
              <option value="poultry">Poultry</option>
              <option value="mixed-use">Mixed-use</option>
            </Select>

            <Input
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes about the farm..."
              as="textarea"
              rows={3}
            />
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
                    {farm ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    <ApperIcon name={farm ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
                    {farm ? "Update Farm" : "Add Farm"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default FarmForm;