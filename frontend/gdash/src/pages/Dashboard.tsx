
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

const data: WeatherData[] = [
  {
    _id: "6930eda0f3eb509218897c7b",
    timestamp: "2025-11-24T23:00",
    locationName: "Camaragibe, PE",
    latitude: -8.03,
    longitude: -34.97,
    temperatureC: 23.5,
    humidityPercent: 88,
    windSpeed: 1.8,
    weatherCode: 2,
    precipitationProbability: 13,
  },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6 text-[hsl(var(--primary-foreground))]">
          Dashboard Meteorológico
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
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
      </main>
    </div>
  );
}
