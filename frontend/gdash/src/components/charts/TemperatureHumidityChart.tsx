import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function TemperatureHumidityChart({ data }) {
  const formattedData = data.map(item => ({
    ...item,
    time: format(parseISO(item.timestamp), 'dd/MM HH:mm', { locale: ptBR }),
    temperature: item.temperatureC,
    humidity: item.humidityPercent,
  }));

  const maxTemp = Math.max(...formattedData.map(d => d.temperature)) + 2;
  const maxHumidity = Math.max(...formattedData.map(d => d.humidity)) + 5;

  const colors = {
    temperature: 'hsl(var(--primary))', 
    humidity: 'hsl(var(--accent))',     
    grid: 'hsl(var(--border))',
    text: 'hsl(var(--foreground))',
    tooltipBg: 'hsl(var(--card))',
    tooltipBorder: 'hsl(var(--border))'
  };

  return (
    <div className="h-[400px] w-full bg-[hsl(var(--card))] p-4 rounded-[var(--radius)] border border-[hsl(var(--border))]">
      <h3 className="text-lg font-semibold mb-4 text-[hsl(var(--foreground))]">
        Temperatura e Umidade - Camaragibe, PE
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={colors.grid}
            strokeOpacity={0.3}
          />
          
          <XAxis 
            dataKey="time" 
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ 
              fontSize: 12, 
              fill: colors.text,
              opacity: 0.8 
            }}
            stroke={colors.text}
            strokeOpacity={0.5}
          />
          
          <YAxis 
            yAxisId="left"
            label={{ 
              value: 'Temperatura (°C)', 
              angle: -90, 
              position: 'insideLeft',
              offset: -10,
              fill: colors.text,
              fontSize: 12
            }}
            domain={[0, maxTemp]}
            tick={{ 
              fontSize: 11, 
              fill: colors.text,
              opacity: 0.8 
            }}
            stroke={colors.text}
            strokeOpacity={0.5}
          />
          
          <YAxis 
            yAxisId="right" 
            orientation="right"
            label={{ 
              value: 'Umidade (%)', 
              angle: 90, 
              position: 'insideRight',
              offset: -10,
              fill: colors.text,
              fontSize: 12
            }}
            domain={[0, maxHumidity]}
            tick={{ 
              fontSize: 11, 
              fill: colors.text,
              opacity: 0.8 
            }}
            stroke={colors.text}
            strokeOpacity={0.5}
          />
          
          <Tooltip 
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              border: `1px solid ${colors.tooltipBorder}`,
              borderRadius: 'var(--radius)',
              color: colors.text,
              fontSize: '12px'
            }}
            formatter={(value, name) => {
              if (name === 'temperature') return [`${value}°C`, 'Temperatura'];
              if (name === 'humidity') return [`${value}%`, 'Umidade'];
              return [value, name];
            }}
            labelFormatter={(label) => `Horário: ${label}`}
          />

          <Legend 
            wrapperStyle={{
              paddingTop: '10px',
              fontSize: '12px',
              color: colors.text
            }}
          />
          
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="temperature"
            name="Temperatura"
            stroke={colors.temperature}
            strokeWidth={3}
            strokeOpacity={0.9}
            dot={{ 
              r: 4, 
              fill: colors.temperature,
              strokeWidth: 0
            }}
            activeDot={{ 
              r: 6, 
              fill: colors.temperature,
              stroke: colors.temperature,
              strokeWidth: 2
            }}
          />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="humidity"
            name="Umidade"
            stroke={colors.humidity}
            strokeWidth={3}
            strokeOpacity={0.9}
            dot={{ 
              r: 4, 
              fill: colors.humidity,
              strokeWidth: 0
            }}
            activeDot={{ 
              r: 6, 
              fill: colors.humidity,
              stroke: colors.humidity,
              strokeWidth: 2
            }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-6 mt-4 text-sm text-[hsl(var(--muted-foreground))]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[hsl(var(--primary))]"></div>
          <span>Temperatura (°C)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[hsl(var(--accent))]"></div>
          <span>Umidade (%)</span>
        </div>
      </div>
    </div>
  );
}