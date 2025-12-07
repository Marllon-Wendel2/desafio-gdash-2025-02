import api from "./api/api";

class WeatherService {
  async getWeather() {
    const response = await api.get("/weather");
    return response.data;
  }
}

const weatherService = new WeatherService();

export default weatherService;
