import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather } from './interfaces/weather.interface';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel('Weather') private readonly weatherModel: Model<Weather>,
  ) {}
  async getWeather() {
    try {
      const result = await this.weatherModel.find();
      return result;
    } catch (error) {
      console.log('Erro ao buscar clima:', error);
      return { error: 'Erro ao buscar clima' };
    }
  }
}
