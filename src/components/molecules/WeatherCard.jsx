import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const WeatherCard = ({ weather, forecast }) => {
  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "sunny": return "Sun";
      case "cloudy": return "Cloud";
      case "rainy": return "CloudRain";
      case "stormy": return "CloudLightning";
      case "snowy": return "Snowflake";
      case "partly cloudy": return "CloudSun";
      default: return "Sun";
    }
  };

  if (!weather) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Current Weather</h3>
          <p className="text-sm text-gray-600">{weather.location}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2">
            <ApperIcon 
              name={getWeatherIcon(weather.condition)} 
              className="w-8 h-8 text-harvest" 
            />
            <span className="text-3xl font-bold text-gray-900">
              {weather.temperature}°
            </span>
          </div>
          <p className="text-sm text-gray-600 capitalize">{weather.condition}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Droplets" className="w-4 h-4 text-info" />
          <span className="text-sm text-gray-600">Humidity: {weather.humidity}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Wind" className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Wind: {weather.windSpeed} mph</span>
        </div>
      </div>

      {forecast && forecast.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">5-Day Forecast</h4>
          <div className="grid grid-cols-5 gap-2">
            {forecast.map((day, index) => (
              <div key={index} className="text-center p-2 rounded-lg bg-gray-50">
                <p className="text-xs font-medium text-gray-600 mb-1">{day.day}</p>
                <ApperIcon 
                  name={getWeatherIcon(day.condition)} 
                  className="w-4 h-4 text-harvest mx-auto mb-1" 
                />
                <p className="text-sm font-semibold text-gray-900">{day.high}°</p>
                <p className="text-xs text-gray-600">{day.low}°</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default WeatherCard;