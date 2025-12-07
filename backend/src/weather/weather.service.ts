import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Weather } from "./interfaces/weather.interface";
import Papa from "papaparse";
import * as XLSX from "xlsx";

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel("Weather") private readonly weatherModel: Model<Weather>
  ) {}
  async getWeather() {
    try {
      const result = await this.weatherModel.find().limit(15).lean();
      return result;
    } catch (error) {
      console.log("Erro ao buscar clima:", error);
      return { error: "Erro ao buscar clima" };
    }
  }

  async export(format: "csv" | "xls") {
    const data = await this.weatherModel.find().lean();

    if (!data || data.length === 0) {
      throw new BadRequestException("Nenhum dado encontrado para exportar.");
    }

    if (format === "csv") {
      return this.exportCSV(data);
    }

    if (format === "xls") {
      return this.exportXLS(data);
    }

    throw new BadRequestException("Formato inválido! Use 'csv' ou 'xls'.");
  }

  private exportCSV(data: any[]): Buffer {
    const csv = Papa.unparse(data);
    return Buffer.from(csv, "utf-8");
  }

  private exportXLS(data: any[]): Buffer {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Weather");

    return XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });
  }
}
