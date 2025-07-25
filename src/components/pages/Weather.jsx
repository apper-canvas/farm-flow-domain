import React, { useState, useEffect } from "react";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import WeatherCard from "@/components/molecules/WeatherCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { weatherService } from "@/services/api/weatherService";
import { farmService } from "@/services/api/farmService";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFarms();
  }, []);

  useEffect(() => {
    if (selectedFarm) {
      loadWeather();
    }
  }, [selectedFarm]);

  const loadFarms = async () => {
    try {
      const farmsData = await farmService.getAll();
      setFarms(farmsData);
      if (farmsData.length > 0) {
        setSelectedFarm(farmsData[0].Id);
      }
    } catch (err) {
      setError("Failed to load farms");
    }
  };

  const loadWeather = async () => {
    if (!selectedFarm) return;
    
    try {
      setLoading(true);
      setError("");
      const farm = farms.find(f => f.Id === parseInt(selectedFarm));
      const weatherData = await weatherService.getWeatherByLocation(farm?.location || "Default Location");
      setWeather(weatherData);
    } catch (err) {
      setError("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  const getSelectedFarmName = () => {
    const farm = farms.find(f => f.Id === parseInt(selectedFarm));
    return farm ? farm.name : "Select a farm";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">Weather</h1>
          <p className="text-gray-600">Stay informed about weather conditions for your farms.</p>
        </div>
        <Button onClick={loadWeather} variant="secondary">
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Farm Selection */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Select
          value={selectedFarm}
          onChange={(e) => setSelectedFarm(e.target.value)}
          className="sm:w-64"
        >
          <option value="">Select a farm</option>
          {farms.map(farm => (
            <option key={farm.Id} value={farm.Id}>{farm.name}</option>
          ))}
        </Select>
        {selectedFarm && (
          <div className="text-sm text-gray-600">
            Showing weather for: <span className="font-medium">{getSelectedFarmName()}</span>
          </div>
        )}
      </div>

      {/* Weather Content */}
      {!selectedFarm ? (
        <div className="text-center py-12">
          <ApperIcon name="Cloud" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Farm</h3>
          <p className="text-gray-600">Choose a farm to view its weather forecast.</p>
        </div>
      ) : loading ? (
        <Loading rows={2} />
      ) : error ? (
        <Error message={error} onRetry={loadWeather} />
      ) : (
        <div className="max-w-2xl">
          <WeatherCard weather={weather} forecast={weather?.forecast} />
          
          {/* Weather Tips */}
          <div className="mt-6 bg-white rounded-xl card-shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <ApperIcon name="Lightbulb" className="w-5 h-5 inline mr-2 text-harvest" />
              Weather Tips
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              {weather && (
                <>
                  {weather.condition.toLowerCase().includes("rain") && (
                    <div className="flex items-start space-x-2">
                      <ApperIcon name="Droplets" className="w-4 h-4 text-info mt-0.5" />
                      <p>Rain expected - consider postponing irrigation and outdoor activities.</p>
                    </div>
                  )}
                  {weather.temperature > 85 && (
                    <div className="flex items-start space-x-2">
                      <ApperIcon name="Thermometer" className="w-4 h-4 text-error mt-0.5" />
                      <p>High temperatures - ensure adequate water supply for crops and livestock.</p>
                    </div>
                  )}
                  {weather.windSpeed > 15 && (
                    <div className="flex items-start space-x-2">
                      <ApperIcon name="Wind" className="w-4 h-4 text-warning mt-0.5" />
                      <p>Strong winds - avoid spraying pesticides or fertilizers.</p>
                    </div>
                  )}
                  {weather.humidity > 80 && (
                    <div className="flex items-start space-x-2">
                      <ApperIcon name="Eye" className="w-4 h-4 text-info mt-0.5" />
                      <p>High humidity - monitor crops for signs of fungal diseases.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;