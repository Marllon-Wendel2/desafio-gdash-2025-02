import api from "./api/api";

class WeatherService {
  async getWeather() {
    try {
      const response = await api.get("/weather");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dados do clima:", error);
      throw error;
    }
  }

  async postWeatherData(data: any) {
    try {
      const response = await api.post("/weather", data);
      return response.data;
    } catch (error) {
      console.error("Erro ao enviar dados do clima:", error);
      throw error;
    }
  }

  async getWeatherByCity(city: string) {
    try {
      const response = await api.get(`/weather/${city}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar clima de ${city}:`, error);
      throw error;
    }
  }
}

const weatherService = new WeatherService();
export default weatherService;
