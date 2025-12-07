import { Module } from "@nestjs/common";
import { WeatherService } from "./weather.service";
import { WeatherController } from "./weather.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { WeatherSchema } from "./interfaces/weather.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Weather", schema: WeatherSchema }]),
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [WeatherModule, WeatherService],
})
export class WeatherModule {}
