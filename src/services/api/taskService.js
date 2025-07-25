class TaskService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "farm_id_c" } },
          { field: { Name: "crop_id_c" } }
        ],
        orderBy: [
          { fieldName: "Id", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching tasks:", response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c,
        type: task.type_c,
        dueDate: task.due_date_c,
        completed: task.completed_c,
        priority: task.priority_c,
        farmId: task.farm_id_c?.Id || task.farm_id_c,
        cropId: task.crop_id_c?.Id || task.crop_id_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching tasks:", error.message);
        throw error;
      }
    }
  }

  async getById(recordId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "farm_id_c" } },
          { field: { Name: "crop_id_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, recordId, params);
      
      if (!response.success) {
        console.error("Error fetching task:", response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c,
        type: task.type_c,
        dueDate: task.due_date_c,
        completed: task.completed_c,
        priority: task.priority_c,
        farmId: task.farm_id_c?.Id || task.farm_id_c,
        cropId: task.crop_id_c?.Id || task.crop_id_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching task:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching task:", error.message);
        throw error;
      }
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [{
          Name: taskData.title,
          title_c: taskData.title,
          type_c: taskData.type,
          due_date_c: taskData.dueDate.split('T')[0], // Convert to date format
          completed_c: taskData.completed,
          priority_c: taskData.priority,
          farm_id_c: parseInt(taskData.farmId),
          crop_id_c: taskData.cropId ? parseInt(taskData.cropId) : null
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating task:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} task records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          return {
            Id: task.Id,
            title: task.title_c,
            type: task.type_c,
            dueDate: task.due_date_c,
            completed: task.completed_c,
            priority: task.priority_c,
            farmId: task.farm_id_c?.Id || task.farm_id_c,
            cropId: task.crop_id_c?.Id || task.crop_id_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error creating task:", error.message);
        throw error;
      }
    }
  }

  async update(id, taskData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: taskData.title,
          title_c: taskData.title,
          type_c: taskData.type,
          due_date_c: taskData.dueDate.split('T')[0], // Convert to date format
          completed_c: taskData.completed,
          priority_c: taskData.priority,
          farm_id_c: parseInt(taskData.farmId),
          crop_id_c: taskData.cropId ? parseInt(taskData.cropId) : null
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating task:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} task records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const task = successfulUpdates[0].data;
          return {
            Id: task.Id,
            title: task.title_c,
            type: task.type_c,
            dueDate: task.due_date_c,
            completed: task.completed_c,
            priority: task.priority_c,
            farmId: task.farm_id_c?.Id || task.farm_id_c,
            cropId: task.crop_id_c?.Id || task.crop_id_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error updating task:", error.message);
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
        console.error("Error deleting task:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} task records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length === 1;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error deleting task:", error.message);
        throw error;
      }
    }
  }
}

export const taskService = new TaskService();