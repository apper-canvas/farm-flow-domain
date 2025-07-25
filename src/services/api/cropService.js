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
    return { ...crop };
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