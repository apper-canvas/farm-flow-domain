import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import CropForm from "@/components/organisms/CropForm";
import CropDetailModal from "@/components/organisms/CropDetailModal";
import CropRow from "@/components/molecules/CropRow";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { cropService } from "@/services/api/cropService";
import { farmService } from "@/services/api/farmService";
import { toast } from "react-toastify";

const Crops = () => {
const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [filterFarm, setFilterFarm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [cropsData, farmsData] = await Promise.all([
        cropService.getAll(),
        farmService.getAll()
      ]);
      setCrops(cropsData);
      setFarms(farmsData);
    } catch (err) {
      setError("Failed to load crops");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (cropData) => {
    try {
      if (editingCrop) {
        await cropService.update(editingCrop.Id, cropData);
        toast.success("Crop updated successfully!");
      } else {
        await cropService.create(cropData);
        toast.success("Crop added successfully!");
      }
      await loadData();
      setShowForm(false);
      setEditingCrop(null);
    } catch (err) {
      toast.error("Failed to save crop");
    }
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setShowForm(true);
  };

  const handleDelete = async (cropId) => {
    if (window.confirm("Are you sure you want to delete this crop?")) {
      try {
        await cropService.delete(cropId);
        toast.success("Crop deleted successfully!");
        await loadData();
      } catch (err) {
        toast.error("Failed to delete crop");
      }
    }
};

  const handleViewDetails = async (crop) => {
    try {
      const detailedCrop = await cropService.getById(crop.Id);
      setSelectedCrop(detailedCrop);
      setShowDetailModal(true);
      toast.success("Crop details loaded successfully");
    } catch (err) {
      toast.error("Failed to load crop details");
    }
  };

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId);
    return farm ? farm.name : "Unknown Farm";
  };

  const filteredCrops = crops.filter(crop => {
    const farmMatch = !filterFarm || crop.farmId === parseInt(filterFarm);
    const statusMatch = !filterStatus || crop.status === filterStatus;
    return farmMatch && statusMatch;
  });

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
          <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">Crops</h1>
          <p className="text-gray-600">Track your planted crops and their progress.</p>
        </div>
        <Button 
          onClick={() => {
            setEditingCrop(null);
            setShowForm(true);
          }}
          variant="primary"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Crop
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <CropForm
          crop={editingCrop}
          farms={farms}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingCrop(null);
          }}
        />
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={filterFarm}
          onChange={(e) => setFilterFarm(e.target.value)}
          className="sm:w-64"
        >
          <option value="">All Farms</option>
          {farms.map(farm => (
            <option key={farm.Id} value={farm.Id}>{farm.name}</option>
          ))}
        </Select>
        
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="sm:w-48"
        >
          <option value="">All Status</option>
          <option value="planted">Planted</option>
          <option value="growing">Growing</option>
          <option value="ready">Ready</option>
          <option value="harvested">Harvested</option>
        </Select>
      </div>

      {/* Crops Table */}
      {filteredCrops.length === 0 ? (
        <Empty
          title="No crops found"
          description={crops.length === 0 
            ? "Start by adding your first crop to track your agricultural progress."
            : "No crops match your current filters. Try adjusting your search criteria."
          }
          actionLabel="Add Crop"
          onAction={() => setShowForm(true)}
          icon="Sprout"
        />
      ) : (
        <div className="bg-white rounded-xl card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Crop
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Farm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Planted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expected Harvest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCrops.map(crop => (
<CropRow
                    key={crop.Id}
                    crop={crop}
                    farmName={getFarmName(crop.farmId)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </tbody>
</table>
          </div>
        </div>
      )}

      <CropDetailModal
        crop={selectedCrop}
        farmName={selectedCrop ? getFarmName(selectedCrop.farmId) : ""}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedCrop(null);
        }}
      />
    </div>
  );
};

export default Crops;