import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Weather } from "src/weather/interfaces/weather.interface";
import { WeatherService } from "src/weather/weather.service";
import { generateInsights } from "./client/client";

@Injectable()
export class GeminiService {
  constructor(private readonly weatherService: WeatherService) {}

  async getInsight() {
    const metaData = await this.weatherService;

    const payload = JSON.stringify(metaData, null, 2);

    return await generateInsights(payload);
  }
}
