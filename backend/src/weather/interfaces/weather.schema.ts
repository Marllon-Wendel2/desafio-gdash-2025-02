import * as mongoose from "mongoose";

export const WeatherSchema = new mongoose.Schema(
  {
    timestamp: String,
    locationName: String,
    latitude: Number,
    longitude: Number,
    temperatureC: Number,
    humidityPercent: Number,
    windSpeed: Number,
    weatherCode: Number,
    precipitationProbability: Number,
  },
  { collection: "weather_logs" }
);
