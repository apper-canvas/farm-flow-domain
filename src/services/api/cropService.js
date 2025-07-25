import cropsData from "@/services/mockData/crops.json";

class CropService {
  constructor() {
    this.crops = [...cropsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.crops];
  }

  async getById(id) {
await this.delay(200);
    const crop = this.crops.find(c => c.Id === parseInt(id));
    if (!crop) {
      throw new Error("Crop not found");
    }
    
    // Enhanced crop data with timeline and yield history
    const enhancedCrop = {
      ...crop,
      timeline: {
        germination: "completed",
        vegetative: crop.status === "growing" ? "current" : "completed",
        flowering: crop.status === "ready" ? "completed" : "pending"
      },
      yieldHistory: this.generateYieldHistory(crop.cropType)
    };
    
    return enhancedCrop;
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
    
    return yields.map((yield, index) => ({
      year: currentYear - 3 + index,
      yield: yield,
      unit: "tons/hectare",
      projected: index === yields.length - 1
    }));
  }

  async create(cropData) {
    await this.delay(400);
    const newCrop = {
      ...cropData,
      Id: Math.max(...this.crops.map(c => c.Id), 0) + 1
    };
    this.crops.push(newCrop);
    return { ...newCrop };
  }

  async update(id, cropData) {
    await this.delay(350);
    const index = this.crops.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Crop not found");
    }
    this.crops[index] = { ...this.crops[index], ...cropData };
    return { ...this.crops[index] };
  }

  async delete(id) {
    await this.delay(300);
    const index = this.crops.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Crop not found");
    }
    this.crops.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const cropService = new CropService();