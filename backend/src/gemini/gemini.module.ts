import { WeatherModule } from "src/weather/weather.module";
import { GeminiController } from "./gemini.controller";
import { GeminiService } from "./gemini.service";
import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [UsersModule, WeatherModule],
  controllers: [GeminiController],
  providers: [GeminiService],
})
export class GeminiModule {}
