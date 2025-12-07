import { 
  ComposedChart, 
  Bar, 
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

export function WindPrecipitationChart({ data }) {
  const formattedData = data.map(item => ({
    ...item,
    time: format(parseISO(item.timestamp), 'dd/MM HH:mm', { locale: ptBR }),
    windSpeed: item.windSpeed,
    precipitation: item.precipitationProbability,
  }));

  const dailyData = formattedData.reduce((acc, item) => {
    const date = item.time.split(' ')[0]; 
    if (!acc[date]) {
      acc[date] = {
        date,
        avgWind: 0,
        maxWind: 0,
        totalPrecipitation: 0,
        count: 0,
      };
    }
    acc[date].avgWind += item.windSpeed;
    acc[date].totalPrecipitation += item.precipitation;
    acc[date].maxWind = Math.max(acc[date].maxWind, item.windSpeed);
    acc[date].count += 1;
    return acc;
  }, {});

  const dailyArray = Object.values(dailyData).map(day => ({
    ...day,
    avgWind: parseFloat((day.avgWind / day.count).toFixed(1)),
    avgPrecipitation: parseFloat((day.totalPrecipitation / day.count).toFixed(1)),
  }));

  const colors = {
    windBar: 'hsl(var(--primary))',
    precipitationLine: 'hsl(var(--accent))',
    grid: 'hsl(var(--border))',
    text: 'hsl(var(--foreground))',
    tooltipBg: 'hsl(var(--card))',
    tooltipBorder: 'hsl(var(--border))',
    maxWind: 'hsl(var(--destructive))'
  };

  const useDailyData = dailyArray.length > 0;
  const chartData = useDailyData ? dailyArray.slice(0, 7) : formattedData.slice(0, 12);

  return (
    <div className="h-[400px] w-full bg-[hsl(var(--card))] p-4 rounded-[var(--radius)] border border-[hsl(var(--border))]">
      <h3 className="text-lg font-semibold mb-4 text-[hsl(var(--foreground))]">
        Velocidade do Vento e Probabilidade de Chuva
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={colors.grid}
            strokeOpacity={0.3}
          />

          <XAxis 
            dataKey={useDailyData ? "date" : "time"}
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ 
              fontSize: 11, 
              fill: colors.text,
              opacity: 0.8 
            }}
            stroke={colors.text}
            strokeOpacity={0.5}
          />

          <YAxis 
            yAxisId="left"
            label={{ 
              value: 'Vento (km/h)', 
              angle: -90, 
              position: 'insideLeft',
              offset: -10,
              fill: colors.text,
              fontSize: 11
            }}
            domain={[0, 'dataMax + 2']}
            tick={{ 
              fontSize: 10, 
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
              value: 'Chuva (%)', 
              angle: 90, 
              position: 'insideRight',
              offset: -10,
              fill: colors.text,
              fontSize: 11
            }}
            domain={[0, 100]}
            tick={{ 
              fontSize: 10, 
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
              fontSize: '12px',
              padding: '8px 12px'
            }}
            formatter={(value, name) => {
              if (name === 'avgWind' || name === 'windSpeed') {
                return [`${value} km/h`, useDailyData ? 'Vento Médio' : 'Velocidade do Vento'];
              }
              if (name === 'maxWind') {
                return [`${value} km/h`, 'Vento Máximo'];
              }
              if (name === 'avgPrecipitation' || name === 'precipitation') {
                return [`${value}%`, useDailyData ? 'Chuva Média' : 'Probabilidade de Chuva'];
              }
              return [value, name];
            }}
            labelFormatter={(label) => `Data: ${label}`}
          />
          
          <Legend 
            wrapperStyle={{
              paddingTop: '10px',
              fontSize: '11px',
              color: colors.text
            }}
          />
          
          <Bar
            yAxisId="left"
            dataKey={useDailyData ? "avgWind" : "windSpeed"}
            name={useDailyData ? "Vento Médio" : "Velocidade do Vento"}
            fill={colors.windBar}
            fillOpacity={0.8}
            barSize={useDailyData ? 30 : 15}
            radius={[2, 2, 0, 0]}
          />
          
          {useDailyData && (
            <Bar
              yAxisId="left"
              dataKey="maxWind"
              name="Vento Máximo"
              fill={colors.maxWind}
              fillOpacity={0.6}
              barSize={15}
              radius={[2, 2, 0, 0]}
            />
          )}
          
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={useDailyData ? "avgPrecipitation" : "precipitation"}
            name={useDailyData ? "Chuva Média" : "Probabilidade de Chuva"}
            stroke={colors.precipitationLine}
            strokeWidth={3}
            strokeOpacity={0.9}
            dot={{ 
              r: 4, 
              fill: colors.precipitationLine,
              strokeWidth: 0
            }}
            activeDot={{ 
              r: 6, 
              fill: colors.precipitationLine,
              stroke: colors.precipitationLine,
              strokeWidth: 2
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      
      <div className="flex justify-center gap-4 mt-4 text-xs text-[hsl(var(--muted-foreground))]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[hsl(var(--primary))]"></div>
          <span>Velocidade do Vento</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[hsl(var(--accent))]"></div>
          <span>Probabilidade de Chuva</span>
        </div>
        {useDailyData && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[hsl(var(--destructive))]"></div>
            <span>Vento Máximo</span>
          </div>
        )}
      </div>
    </div>
  );
}