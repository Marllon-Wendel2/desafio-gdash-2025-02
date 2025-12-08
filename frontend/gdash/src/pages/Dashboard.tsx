'use client'

import { WindPrecipitationChart } from "../components/charts/WindPrecipitationChart";
import { TemperatureHumidityChart } from "../components/charts/TemperatureHumidityChart";
import { showToast } from "../lib/toast";
import weatherService from "../service/weather";
import { useEffect, useState } from "react";

type WeatherData = {
  _id: string;
  timestamp: string;
  locationName: string;
  latitude: number;
  longitude: number;
  temperatureC: number;
  humidityPercent: number;
  windSpeed: number;
  weatherCode: number;
  precipitationProbability: number;
};

export default function Dashboard() {
    const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { console.log(weatherData)}, [weatherData]);


    useEffect(() => {
        const fetchData = async () => {
            try {
            setLoading(true);
            // showToast("Carregando dados...", "info");
            const res = await weatherService.getWeather();
            setWeatherData(res);
            // showToast("Dados carregados com sucesso!", "success");
            setLoading(false);
            } catch (err) {
            console.error(err);
            showToast("Erro ao carregar dados!", "error");
            }
        };

        fetchData();
    }, []);

  return (
    <div className="flex flex-col h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <main className="flex-1 p-6 overflow-auto">

        <div className="m-4">
           <h1 className="text-2xl font-bold mb-6 text-[hsl(var(--primary-foreground))]">
            Velocidade do Vento e Probabilidade de Chuva
          </h1>

          <WindPrecipitationChart data={weatherData} />
        </div>
        <div className="m-4">
           <h1 className="text-2xl font-bold mb-6 text-[hsl(var(--primary-foreground))]">
            Temperatura e Umidade
          </h1>

          <TemperatureHumidityChart data={weatherData} />
        </div>
        
        <div className="m-4">
          <h1 className="text-2xl font-bold mb-6 text-[hsl(var(--primary-foreground))]">
            Resumo em cards
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {weatherData.map((item) => (
            <div
              key={item._id}
              className="p-4 bg-[hsl(var(--card))] rounded-[var(--radius)] shadow hover:shadow-lg transition"
            >
              <h2 className="font-semibold text-lg mb-2 text-[hsl(var(--primary-foreground))]">
                {item.locationName}
              </h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                <strong>Data:</strong> {new Date(item.timestamp).toLocaleString()}
              </p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                <strong>Temperatura:</strong> {item.temperatureC}°C
              </p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                <strong>Umidade:</strong> {item.humidityPercent}%
              </p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                <strong>Vento:</strong> {item.windSpeed} m/s
              </p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                <strong>Prob. Chuva:</strong> {item.precipitationProbability}%
              </p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                <strong>Código Clima:</strong> {item.weatherCode}
              </p>
            </div>
          ))}
        </div>
        </div>

      </main>
    </div>
  );
}
