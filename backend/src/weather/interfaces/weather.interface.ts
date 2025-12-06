import { Document } from "mongoose";

export interface Weather extends Document {
  id: string;
  timestamp: string;
  locationName: string;
  latitude: number;
  longitude: number;
  temperatureC: number;
  humidityPercent: number;
  windSpeed: number;
  weatherCode: number;
  precipitationProbability: number;
}
