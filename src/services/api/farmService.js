class FarmService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'farm_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
{ field: { Name: "Name" } },
          { field: { Name: "size_c" } },
          { field: { Name: "size_unit_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "soil_type_c" } },
          { field: { Name: "farm_type_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "contact_number_c" } },
          { field: { Name: "gps_coordinates_c" } },
          { field: { Name: "water_resource_c" } },
          { field: { Name: "machinery_available_c" } }
        ],
        orderBy: [
          { fieldName: "Id", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching farms:", response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
return response.data.map(farm => ({
        Id: farm.Id,
        name: farm.Name,
        size: farm.size_c,
        sizeUnit: farm.size_unit_c,
        location: farm.location_c,
        createdAt: farm.created_at_c,
        soilType: farm.soil_type_c,
        farmType: farm.farm_type_c,
        notes: farm.notes_c,
        contactNumber: farm.contact_number_c,
        gpsCoordinates: farm.gps_coordinates_c,
        waterResource: farm.water_resource_c,
        machineryAvailable: farm.machinery_available_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching farms:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching farms:", error.message);
        throw error;
      }
    }
  }

  async getById(recordId) {
    try {
      const params = {
fields: [
          { field: { Name: "Name" } },
          { field: { Name: "size_c" } },
          { field: { Name: "size_unit_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "soil_type_c" } },
          { field: { Name: "farm_type_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "contact_number_c" } },
          { field: { Name: "gps_coordinates_c" } },
          { field: { Name: "water_resource_c" } },
          { field: { Name: "machinery_available_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, recordId, params);
      
      if (!response.success) {
        console.error("Error fetching farm:", response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      const farm = response.data;
return {
        Id: farm.Id,
        name: farm.Name,
        size: farm.size_c,
        sizeUnit: farm.size_unit_c,
        location: farm.location_c,
        createdAt: farm.created_at_c,
        soilType: farm.soil_type_c,
        farmType: farm.farm_type_c,
        notes: farm.notes_c,
        contactNumber: farm.contact_number_c,
        gpsCoordinates: farm.gps_coordinates_c,
        waterResource: farm.water_resource_c,
        machineryAvailable: farm.machinery_available_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching farm:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching farm:", error.message);
        throw error;
      }
    }
  }

  async create(farmData) {
    try {
      const params = {
records: [{
          Name: farmData.name,
          size_c: farmData.size,
          size_unit_c: farmData.sizeUnit,
          location_c: farmData.location,
          created_at_c: new Date().toISOString(),
          soil_type_c: farmData.soilType,
          farm_type_c: farmData.farmType,
          notes_c: farmData.notes,
          contact_number_c: farmData.contactNumber,
          gps_coordinates_c: farmData.gpsCoordinates,
          water_resource_c: farmData.waterResource,
          machinery_available_c: farmData.machineryAvailable
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating farm:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} farm records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const farm = successfulRecords[0].data;
return {
            Id: farm.Id,
            name: farm.Name,
            size: farm.size_c,
            sizeUnit: farm.size_unit_c,
            location: farm.location_c,
            createdAt: farm.created_at_c,
            soilType: farm.soil_type_c,
            farmType: farm.farm_type_c,
            notes: farm.notes_c,
            contactNumber: farm.contact_number_c,
            gpsCoordinates: farm.gps_coordinates_c,
            waterResource: farm.water_resource_c,
            machineryAvailable: farm.machinery_available_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating farm:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error creating farm:", error.message);
        throw error;
      }
    }
  }

  async update(id, farmData) {
    try {
      const params = {
records: [{
Id: parseInt(id),
          Name: farmData.name,
          size_c: farmData.size,
          size_unit_c: farmData.sizeUnit,
          location_c: farmData.location,
          soil_type_c: farmData.soilType,
          farm_type_c: farmData.farmType,
          notes_c: farmData.notes,
          contact_number_c: farmData.contactNumber,
          gps_coordinates_c: farmData.gpsCoordinates,
          water_resource_c: farmData.waterResource,
          machinery_available_c: farmData.machineryAvailable
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating farm:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} farm records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const farm = successfulUpdates[0].data;
return {
            Id: farm.Id,
            name: farm.Name,
            size: farm.size_c,
            sizeUnit: farm.size_unit_c,
            location: farm.location_c,
            createdAt: farm.created_at_c,
            soilType: farm.soil_type_c,
            farmType: farm.farm_type_c,
            notes: farm.notes_c,
            contactNumber: farm.contact_number_c,
            gpsCoordinates: farm.gps_coordinates_c,
            waterResource: farm.water_resource_c,
            machineryAvailable: farm.machinery_available_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating farm:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error updating farm:", error.message);
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
        console.error("Error deleting farm:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} farm records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length === 1;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting farm:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error deleting farm:", error.message);
        throw error;
      }
    }
  }
}

export const farmService = new FarmService();