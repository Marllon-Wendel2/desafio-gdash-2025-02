import { Injectable } from "@nestjs/common";
import { main } from "./client/client";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Weather } from "src/weather/interfaces/weather.interface";
import { WeatherService } from "src/weather/weather.service";

@Injectable()
export class GeminiService {
  constructor(private readonly weatherService: WeatherService) {}

  async getInsight() {
    const metaData = await this.weatherService.getWeather();

    const payload = JSON.stringify(metaData, null, 2);

    return await main(payload);
  }
}
