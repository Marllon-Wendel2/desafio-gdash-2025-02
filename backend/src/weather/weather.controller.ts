import { Controller, Get, Param, Res, UseGuards } from "@nestjs/common";
import { WeatherService } from "./weather.service";
import type { Response } from "express";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("weather")
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getWeather() {
    return this.weatherService.getWeather();
  }

  @Get(":type")
  async export(@Param("type") type: "csv" | "xls", @Res() res: Response) {
    const file = await this.weatherService.export(type);

    const fileName = `weather.${type === "csv" ? "csv" : "xlsx"}`;

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    return res.send(file);
  }
}
