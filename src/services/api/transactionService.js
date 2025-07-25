class TransactionService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'transaction_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "farm_id_c" } }
        ],
        orderBy: [
          { fieldName: "Id", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Error fetching transactions:", response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      return response.data.map(transaction => ({
        Id: transaction.Id,
        type: transaction.type_c,
        category: transaction.category_c,
        amount: transaction.amount_c,
        date: transaction.date_c,
        description: transaction.description_c,
        farmId: transaction.farm_id_c?.Id || transaction.farm_id_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching transactions:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching transactions:", error.message);
        throw error;
      }
    }
  }

  async getById(recordId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "farm_id_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, recordId, params);
      
      if (!response.success) {
        console.error("Error fetching transaction:", response.message);
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      const transaction = response.data;
      return {
        Id: transaction.Id,
        type: transaction.type_c,
        category: transaction.category_c,
        amount: transaction.amount_c,
        date: transaction.date_c,
        description: transaction.description_c,
        farmId: transaction.farm_id_c?.Id || transaction.farm_id_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching transaction:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching transaction:", error.message);
        throw error;
      }
    }
  }

  async create(transactionData) {
    try {
      const params = {
        records: [{
          Name: `${transactionData.category} - ${transactionData.type}`,
          type_c: transactionData.type,
          category_c: transactionData.category,
          amount_c: transactionData.amount,
          date_c: transactionData.date.split('T')[0], // Convert to date format
          description_c: transactionData.description,
          farm_id_c: parseInt(transactionData.farmId)
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error creating transaction:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} transaction records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const transaction = successfulRecords[0].data;
          return {
            Id: transaction.Id,
            type: transaction.type_c,
            category: transaction.category_c,
            amount: transaction.amount_c,
            date: transaction.date_c,
            description: transaction.description_c,
            farmId: transaction.farm_id_c?.Id || transaction.farm_id_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating transaction:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error creating transaction:", error.message);
        throw error;
      }
    }
  }

  async update(id, transactionData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${transactionData.category} - ${transactionData.type}`,
          type_c: transactionData.type,
          category_c: transactionData.category,
          amount_c: transactionData.amount,
          date_c: transactionData.date.split('T')[0], // Convert to date format
          description_c: transactionData.description,
          farm_id_c: parseInt(transactionData.farmId)
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Error updating transaction:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} transaction records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const transaction = successfulUpdates[0].data;
          return {
            Id: transaction.Id,
            type: transaction.type_c,
            category: transaction.category_c,
            amount: transaction.amount_c,
            date: transaction.date_c,
            description: transaction.description_c,
            farmId: transaction.farm_id_c?.Id || transaction.farm_id_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating transaction:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error updating transaction:", error.message);
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
        console.error("Error deleting transaction:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} transaction records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulDeletions.length === 1;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting transaction:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error deleting transaction:", error.message);
        throw error;
      }
    }
  }
}

export const transactionService = new TransactionService();