class CropService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'crop_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "crop_type_c" } },
          { field: { Name: "field_c" } },
          { field: { Name: "planting_date_c" } },
          { field: { Name: "expected_harvest_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "farm_id_c" } }
        ],
        orderBy: [
          { fieldName: "Id", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching crops:", response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      return response.data.map(crop => ({
        Id: crop.Id,
        cropType: crop.crop_type_c,
        field: crop.field_c,
        plantingDate: crop.planting_date_c,
        expectedHarvest: crop.expected_harvest_c,
        status: crop.status_c,
        farmId: crop.farm_id_c?.Id || crop.farm_id_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching crops:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching crops:", error.message);
        throw error;
      }
    }
  }

  async getById(recordId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "crop_type_c" } },
          { field: { Name: "field_c" } },
          { field: { Name: "planting_date_c" } },
          { field: { Name: "expected_harvest_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "farm_id_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, recordId, params);
      
      if (!response.success) {
        console.error("Error fetching crop:", response.message);
        throw new Error(response.message);
      }

      // Transform data and add enhanced features
      const crop = response.data;
      const enhancedCrop = {
        Id: crop.Id,
        cropType: crop.crop_type_c,
        field: crop.field_c,
        plantingDate: crop.planting_date_c,
        expectedHarvest: crop.expected_harvest_c,
        status: crop.status_c,
        farmId: crop.farm_id_c?.Id || crop.farm_id_c,
        timeline: {
          germination: "completed",
          vegetative: crop.status_c === "growing" ? "current" : "completed",
          flowering: crop.status_c === "ready" ? "completed" : "pending"
        },
        yieldHistory: this.generateYieldHistory(crop.crop_type_c)
      };
      
      return enhancedCrop;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching crop:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching crop:", error.message);
        throw error;
      }
    }
  }

  generateYieldHistory(cropType) {
    const baseYields = {
      "Corn": [85, 92, 88, 95],
      "Soybeans": [45, 52, 49, 55],
      "Wheat": [65, 68, 62, 70],
      "Tomatoes": [120, 115, 128, 135],
      "Potatoes": [95, 102, 98, 108]
    };
    
    const yields = baseYields[cropType] || [75, 80, 85, 90];
    const currentYear = new Date().getFullYear();
    
    return yields.map((yieldValue, index) => ({
      year: currentYear - 3 + index,
      yield: yieldValue,
      unit: "tons/hectare",
      projected: index === yields.length - 1
    }));
  }

  async create(cropData) {
    try {
      const params = {
        records: [{
          Name: cropData.cropType,
          crop_type_c: cropData.cropType,
          field_c: cropData.field,
          planting_date_c: cropData.plantingDate,
          expected_harvest_c: cropData.expectedHarvest,
          status_c: cropData.status,
          farm_id_c: parseInt(cropData.farmId)
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating crop:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} crop records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const crop = successfulRecords[0].data;
          return {
            Id: crop.Id,
            cropType: crop.crop_type_c,
            field: crop.field_c,
            plantingDate: crop.planting_date_c,
            expectedHarvest: crop.expected_harvest_c,
            status: crop.status_c,
            farmId: crop.farm_id_c?.Id || crop.farm_id_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating crop:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error creating crop:", error.message);
        throw error;
      }
    }
  }

  async update(id, cropData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: cropData.cropType,
          crop_type_c: cropData.cropType,
          field_c: cropData.field,
          planting_date_c: cropData.plantingDate,
          expected_harvest_c: cropData.expectedHarvest,
          status_c: cropData.status,
          farm_id_c: parseInt(cropData.farmId)
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating crop:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} crop records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const crop = successfulUpdates[0].data;
          return {
            Id: crop.Id,
            cropType: crop.crop_type_c,
            field: crop.field_c,
            plantingDate: crop.planting_date_c,
            expectedHarvest: crop.expected_harvest_c,
            status: crop.status_c,
            farmId: crop.farm_id_c?.Id || crop.farm_id_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating crop:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error updating crop:", error.message);
        throw error;
      }
    }
  }

  async delete(recordId) {
    try {
      const params = {
        RecordIds: [parseInt(recordId)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error deleting crop:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} crop records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length === 1;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting crop:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error deleting crop:", error.message);
        throw error;
      }
    }
  }
}

export const cropService = new CropService();