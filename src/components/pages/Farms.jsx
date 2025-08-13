import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import FarmForm from "@/components/organisms/FarmForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { toast } from "react-toastify";

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [farmsData, cropsData] = await Promise.all([
        farmService.getAll(),
        cropService.getAll()
      ]);
      setFarms(farmsData);
      setCrops(cropsData);
    } catch (err) {
      setError("Failed to load farms");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (farmData) => {
    try {
      if (editingFarm) {
        await farmService.update(editingFarm.Id, farmData);
        toast.success("Farm updated successfully!");
      } else {
        await farmService.create(farmData);
        toast.success("Farm added successfully!");
      }
      await loadData();
      setShowForm(false);
      setEditingFarm(null);
    } catch (err) {
      toast.error("Failed to save farm");
    }
  };

  const handleEdit = (farm) => {
    setEditingFarm(farm);
    setShowForm(true);
  };

  const handleDelete = async (farmId) => {
    if (window.confirm("Are you sure you want to delete this farm?")) {
      try {
        await farmService.delete(farmId);
        toast.success("Farm deleted successfully!");
        await loadData();
      } catch (err) {
        toast.error("Failed to delete farm");
      }
    }
  };

  const getActiveCropsCount = (farmId) => {
    return crops.filter(crop => crop.farmId === farmId && crop.status !== "harvested").length;
  };

  if (loading) return (
    <div className="p-6">
      <Loading rows={3} />
    </div>
  );

  if (error) return (
    <div className="p-6">
      <Error message={error} onRetry={loadData} />
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">Farms</h1>
          <p className="text-gray-600">Manage your farm properties and locations.</p>
        </div>
        <Button 
          onClick={() => {
            setEditingFarm(null);
            setShowForm(true);
          }}
          variant="primary"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Farm
        </Button>
      </div>

{/* Modal */}
      {showForm && (
        <FarmForm
          farm={editingFarm}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingFarm(null);
          }}
        />
      )}
      {/* Farms Grid */}
      {farms.length === 0 ? (
        <Empty
          title="No farms added yet"
          description="Start by adding your first farm to begin tracking your agricultural operations."
          actionLabel="Add Farm"
          onAction={() => setShowForm(true)}
          icon="Map"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map(farm => (
            <Card key={farm.Id} className="p-6" hover>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center">
                    <ApperIcon name="Map" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{farm.name}</h3>
                    <p className="text-sm text-gray-600">{farm.location}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(farm)}>
                    <ApperIcon name="Edit" className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(farm.Id)}>
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </Button>
                </div>
              </div>

<div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Size</span>
                  <span className="font-semibold text-gray-900">
                    {farm.size} {farm.sizeUnit}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Crops</span>
                  <Badge variant="planted">
                    {getActiveCropsCount(farm.Id)} crops
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Contact Number</span>
                  <span className="font-semibold text-gray-900">
                    {farm.contactNumber || 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">GPS Coordinates</span>
                  <span className="font-semibold text-gray-900 text-xs">
                    {farm.gpsCoordinates || 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Water Resource</span>
                  <Badge variant={farm.waterResource ? "success" : "secondary"}>
                    {farm.waterResource || 'Not specified'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Machinery</span>
                  <Badge variant={farm.machineryAvailable === 'Available' ? "success" : "secondary"}>
                    {farm.machineryAvailable || 'Not specified'}
                  </Badge>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <ApperIcon name="Calendar" className="w-4 h-4" />
                    <span>Added {new Date(farm.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Farms;