import weatherData from "@/services/mockData/weather.json";

class WeatherService {
  constructor() {
    this.weatherData = { ...weatherData };
  }

  async getCurrentWeather() {
    await this.delay(400);
    return {
      ...this.weatherData.current,
      forecast: [...this.weatherData.forecast]
    };
  }

  async getWeatherByLocation(location) {
    await this.delay(450);
    
    // Simulate different weather based on location
    const locationWeather = {
      ...this.weatherData.current,
      location: location,
      temperature: this.weatherData.current.temperature + Math.floor(Math.random() * 20) - 10,
      forecast: [...this.weatherData.forecast]
    };

    return locationWeather;
  }

  async getForecast(days = 5) {
    await this.delay(350);
    return [...this.weatherData.forecast].slice(0, days);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const weatherService = new WeatherService();