import { Injectable } from '@nestjs/common';

@Injectable()
export class WeatherService {
  async getWeather() {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${process.env.LAT}&lon=${process.env.LON}&appid=${process.env.API_KEY}&units=metric&lang=pt_br`,
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Erro ao buscar clima:', error);
      return { error: 'Erro ao buscar clima' };
    }
  }
}
